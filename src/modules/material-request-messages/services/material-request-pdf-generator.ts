import { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { AssetsService, TranslationsService } from '@meemoo/admin-core-api';
import { Injectable } from '@nestjs/common';
import { AvoFileUploadAssetType } from '@viaa/avo2-types';
import { format, isValid, Locale as DateFnsLocale, parseISO } from 'date-fns';
import { enGB, nlBE } from 'date-fns/locale';
import PDFDocument from 'pdfkit';
import { Lookup_App_Material_Request_Message_Type_Enum } from '~generated/graphql-db-types-hetarchief';
import {
	GET_MATERIAL_REQUEST_EXTRA_CONDITION_LABELS,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE,
	GET_REUSE_LABELS,
} from '~modules/material-request-messages/material-request-messages.const';
import {
	type MaterialRequestEvent,
	type MaterialRequestMessageBodyAdditionalConditions,
	type MaterialRequestMessageBodyStatusUpdateWithMotivation,
	MaterialRequestTimeUsage,
} from '~modules/material-request-messages/material-request-messages.types';
import {
	MaterialRequest,
	MaterialRequestDurationType,
	MaterialRequestReuseFormKey,
} from '~modules/material-requests/material-requests.types';
import { Locale } from '~shared/types/types';

const FONTS_DIR = join(__dirname, '../../../assets/fonts/sofia-pro');
const FONT_REGULAR = join(FONTS_DIR, 'sofia-pro-regular.woff');
const FONT_BOLD = join(FONTS_DIR, 'sofia-pro-bold.woff');
const FONT_ITALIC = join(FONTS_DIR, 'sofia-pro-regular-italic.woff');
const SOFIA_PRO_BOLD = 'SofiaProBold';
const SOFIA_PRO_REGULAR = 'SofiaProRegular';
const SOFIA_PRO_ITALIC = 'SofiaProItalic';

const COLORS = {
	title: '#00857d',
	text: '#222222',
	muted: '#888888',
	borderColor: '#d1d5db',
};

const DATE_FNS_LOCALE_BY_LOCALE: Record<Locale, DateFnsLocale> = {
	en: enGB as unknown as DateFnsLocale,
	nl: nlBE as unknown as DateFnsLocale,
};

@Injectable()
export class MaterialRequestPdfGeneratorService {
	constructor(
		private translationsService: TranslationsService,
		private assetsService: AssetsService
	) {}

	private formatDate(date: string | null, locale: Locale): string {
		return format(parseISO(date), 'PP', {
			locale: DATE_FNS_LOCALE_BY_LOCALE[locale] || DATE_FNS_LOCALE_BY_LOCALE[Locale.Nl],
		});
	}

	/**
	 * Formats a number of seconds to a string of the shape: HH:mm:ss
	 * @param totalSeconds
	 * @private
	 */
	private formatSecondsToTimestamp(totalSeconds?: number | null): string {
		if (totalSeconds == null || Number.isNaN(totalSeconds)) return '-';

		const seconds = Math.max(0, Math.floor(totalSeconds));
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hrs > 0) {
			return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
		}

		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	}

	/**
	 * Get's the start and endtime that was selected on the video/audio timeline. eg: 00:12:00 - 00:15:00
	 * @param materialRequest
	 * @param locale
	 */
	private getFragmentSelection = (materialRequest: MaterialRequest, locale) => {
		return materialRequest.reuseForm?.durationType === MaterialRequestDurationType.PARTIAL
			? `${this.formatSecondsToTimestamp(materialRequest.reuseForm.startTime)} - ${this.formatSecondsToTimestamp(materialRequest.reuseForm.endTime)}`
			: this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___volledig-materiaal',
					{},
					locale
				);
	};

	/**
	 * Returns the translated values for the text in the pdf using the same keys as the frontend,
	 * so we hopefully don't have to add these translations twice
	 * @param request The material request containing the reuse form with the values to get the labels for.
	 * @param locale the language you want the labels in. 'nl' or 'en'
	 * @private
	 */
	private getTranslatedLabels(
		request: MaterialRequest,
		locale: Locale
	): Array<{ label: string; value: string }> {
		const { reuseForm } = request;
		const LABELS = GET_REUSE_LABELS(this.translationsService, locale);

		let timeUsage: string =
			LABELS[MaterialRequestReuseFormKey.timeUsageType][reuseForm.timeUsageType];
		if (reuseForm.timeUsageType === MaterialRequestTimeUsage.IN_TIME) {
			timeUsage += `: ${this.formatDate(reuseForm.timeUsageFrom, locale)} - ${this.formatDate(reuseForm.timeUsageTo, locale)}`;
		}

		return [
			{
				label: this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___materiaalselectie',
					{},
					locale
				),
				value: this.getFragmentSelection(request, locale),
			},
			{
				label: this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___downloadkwaliteit-label',
					{},
					locale
				),
				value: LABELS[MaterialRequestReuseFormKey.downloadQuality][reuseForm.downloadQuality],
			},
			{
				label: this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___bedoeld-gebruik-label',
					{},
					locale
				),
				value: LABELS[MaterialRequestReuseFormKey.intendedUsage][reuseForm.intendedUsage],
			},
			{
				label: this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___bedoeld-gebruik-beschrijving-label',
					{},
					locale
				),
				value: `${this.translationsService.tText(
					'modules/account/utils/create-label-value-material-request-reuse-form___opmerking',
					{},
					locale
				)}: ${reuseForm.intendedUsageDescription?.trim() || '-'}`,
			},
			{
				label: this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___ontsluiting-materiaal-label',
					{},
					locale
				),
				value: LABELS[MaterialRequestReuseFormKey.distributionAccess][reuseForm.distributionAccess],
			},
			{
				label: this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___type-ontsluiting-label',
					{},
					locale
				),
				value: LABELS[MaterialRequestReuseFormKey.distributionType][reuseForm.distributionType],
			},
			{
				label: this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___wijziging-materiaal-label',
					{},
					locale
				),
				value: LABELS[MaterialRequestReuseFormKey.materialEditing][reuseForm.materialEditing],
			},
			{
				label: this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___geografisch-gebruik-label',
					{},
					locale
				),
				value: LABELS[MaterialRequestReuseFormKey.geographicalUsage][reuseForm.geographicalUsage],
			},
			{
				label: this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___gebruik-in-de-tijd-label',
					{},
					locale
				),
				value: timeUsage,
			},
			{
				label: this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___bronvermelding-label',
					{},
					locale
				),
				value: LABELS[MaterialRequestReuseFormKey.copyrightDisplay][reuseForm.copyrightDisplay],
			},
		];
	}

	private h1(doc: PDFKit.PDFDocument, contentWidth: number, text: string): void {
		doc
			.font(SOFIA_PRO_BOLD)
			.fontSize(22)
			.fillColor(COLORS.title)
			.text(text, { width: contentWidth });
		doc.moveDown(0.75);
	}

	private h2(doc: PDFKit.PDFDocument, contentWidth: number, text: string): void {
		doc
			.font(SOFIA_PRO_BOLD)
			.fontSize(13)
			.fillColor(COLORS.text)
			.text(text, { width: contentWidth });
		doc.moveDown(0.5);
	}

	private h3(doc: PDFKit.PDFDocument, contentWidth: number, text: string): void {
		doc
			.font(SOFIA_PRO_BOLD)
			.fontSize(11)
			.fillColor(COLORS.text)
			.text(text, { width: contentWidth });
	}

	private text(doc: PDFKit.PDFDocument, contentWidth: number, value: string): void {
		doc
			.font(SOFIA_PRO_ITALIC)
			.fontSize(10)
			.fillColor(COLORS.text)
			.text(value || '-', { width: contentWidth });
	}

	private greyText(doc: PDFKit.PDFDocument, contentWidth: number, value: string): void {
		doc
			.font(SOFIA_PRO_ITALIC)
			.fontSize(10)
			.fillColor(COLORS.muted)
			.text(value || '-', { width: contentWidth });
	}

	private addGeneralMaterialRequestInfo(
		doc: PDFKit.PDFDocument,
		contentWidth: number,
		materialRequest: MaterialRequest,
		locale
	): void {
		// h2 — Gegevens over jouw aanvraag
		this.h2(
			doc,
			contentWidth,
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___gegevens-over-jouw-aanvraag',
				{},
				locale
			)
		);

		this.h3(
			doc,
			contentWidth,
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___materiaal',
				{},
				locale
			)
		);
		this.text(doc, contentWidth, materialRequest.objectSchemaName);
		this.greyText(doc, contentWidth, materialRequest.objectSchemaIdentifier);
		this.greyText(doc, contentWidth, materialRequest.maintainerName);
		this.greyText(doc, contentWidth, this.getFragmentSelection(materialRequest, locale));
		doc.moveDown(0.5);

		this.h3(
			doc,
			contentWidth,
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___type-aanvraag',
				{},
				locale
			)
		);
		this.text(
			doc,
			contentWidth,
			GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE(locale, this.translationsService)[
				materialRequest.type
			]
		);
		doc.moveDown(0.5);

		this.h3(
			doc,
			contentWidth,
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___aanvrager',
				{},
				locale
			)
		);
		this.text(doc, contentWidth, materialRequest.requesterFullName);
		this.greyText(doc, contentWidth, materialRequest.requesterMail);
		doc.moveDown(0.5);

		this.h3(
			doc,
			contentWidth,
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___organisatie',
				{},
				locale
			)
		);
		this.text(doc, contentWidth, materialRequest.requesterOrganisation);
		if (materialRequest.requesterOrganisationSector) {
			this.greyText(doc, contentWidth, materialRequest.requesterOrganisationSector);
		}
		doc.moveDown(0.5);

		this.h3(
			doc,
			contentWidth,
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___naam-aanvraag',
				{},
				locale
			)
		);
		this.text(doc, contentWidth, materialRequest.requestGroupName);
		doc.moveDown(1.5);
	}

	private setupPdfDoc(
		title: string,
		locale: Locale
	): [PDFKit.PDFDocument, Promise<Buffer<ArrayBufferLike>>, number, number] {
		const margin = 50;
		const doc = new PDFDocument({
			size: 'A4',
			margin,
			bufferPages: true,
			info: {
				Title: title,
				Author: this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___pdf-document-author-meemoo',
					{},
					locale
				),
				Subject: title,
			},
		});

		doc.registerFont(SOFIA_PRO_BOLD, FONT_BOLD);
		doc.registerFont(SOFIA_PRO_REGULAR, FONT_REGULAR);
		doc.registerFont(SOFIA_PRO_ITALIC, FONT_ITALIC);

		const chunks: Buffer[] = [];
		doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

		const pdfBufferPromise = new Promise<Buffer>((resolve, reject) => {
			doc.on('end', () => resolve(Buffer.concat(chunks)));
			doc.on('error', reject);
		});

		const contentWidth = doc.page.width - margin * 2;

		return [doc, pdfBufferPromise, margin, contentWidth];
	}

	private mapEventToStatusLabel(
		event: MaterialRequestEvent,
		materialRequest: MaterialRequest,
		locale: Locale
	): string {
		const dateStr = this.formatDateWithTime(event.createdAt);

		switch (event.messageType) {
			case Lookup_App_Material_Request_Message_Type_Enum.Approved:
				return this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___goedgekeurd-op-approved-at',
					{ approvedAt: dateStr },
					locale
				);
			case Lookup_App_Material_Request_Message_Type_Enum.Denied:
				return this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___geweigerd-op-denied-at',
					{ deniedAt: dateStr },
					locale
				);
			case Lookup_App_Material_Request_Message_Type_Enum.Cancelled:
			case Lookup_App_Material_Request_Message_Type_Enum.AdditionalConditionsDenied:
				return this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___geannuleerd-op-cancelled-at',
					{ cancelledAt: dateStr },
					locale
				);
			case Lookup_App_Material_Request_Message_Type_Enum.DownloadAvailable:
				return this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___download-beschikbaar-van-tot',
					{
						availableAt: this.formatDateWithTime(materialRequest.downloadAvailableAt),
						expiresAt: this.formatDateWithTime(materialRequest.downloadExpiresAt),
					},
					locale
				);
			case Lookup_App_Material_Request_Message_Type_Enum.AdditionalConditions:
				return this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___voorwaarden-verstuurd-op',
					{ sentAt: dateStr },
					locale
				);
			case Lookup_App_Material_Request_Message_Type_Enum.AdditionalConditionsAccepted:
				return this.translationsService.tText(
					'modules/material-request-messages/services/material-request-pdf-generator___voorwaarden-aanvaard-op',
					{ sentAt: dateStr },
					locale
				);
			default:
				return '';
		}
	}

	private renderTableRow(
		doc: PDFKit.PDFDocument,
		margin: number,
		rowY: number,
		cells: { text: string; width: number }[],
		isHeader: boolean
	): number {
		const cellPadding = 8;
		const font = isHeader ? SOFIA_PRO_BOLD : SOFIA_PRO_REGULAR;

		const cellHeights = cells.map(
			({ text, width }) =>
				doc
					.font(font)
					.fontSize(10)
					.heightOfString(text, { width: width - cellPadding * 2 }) +
				cellPadding * 2
		);
		const rowHeight = Math.max(28, ...cellHeights);

		let cellX = margin;
		for (const { text, width } of cells) {
			doc.rect(cellX, rowY, width, rowHeight).stroke(COLORS.borderColor);
			doc
				.font(font)
				.fontSize(10)
				.fillColor(COLORS.text)
				.text(text, cellX + cellPadding, rowY + cellPadding, {
					width: width - cellPadding * 2,
				});
			cellX += width;
		}

		doc.y = rowY + rowHeight;
		doc.x = margin;

		return rowHeight;
	}

	private addPageNumbers(doc: PDFKit.PDFDocument, margin: number, contentWidth: number): void {
		const { start, count } = doc.bufferedPageRange();
		for (let i = start; i < start + count; i++) {
			doc.switchToPage(i);
			const oldBottomMargin = doc.page.margins.bottom;
			doc.page.margins.bottom = 0;
			doc
				.font(SOFIA_PRO_REGULAR)
				.fontSize(9)
				.fillColor(COLORS.muted)
				.text(`${i - start + 1} / ${count}`, margin, doc.page.height - 30, {
					width: contentWidth,
					align: 'right',
					lineBreak: false,
				});
			doc.page.margins.bottom = oldBottomMargin;
		}
	}

	private addMotivationSection(
		doc: PDFKit.PDFDocument,
		contentWidth: number,
		materialRequest: MaterialRequest,
		locale: Locale
	): void {
		const findEvent = (type: Lookup_App_Material_Request_Message_Type_Enum) =>
			materialRequest.history.find((e) => e.messageType === type);

		const deniedEvent = findEvent(Lookup_App_Material_Request_Message_Type_Enum.Denied);
		const approvedEvent = findEvent(Lookup_App_Material_Request_Message_Type_Enum.Approved);
		const additionalConditionsEvent = findEvent(
			Lookup_App_Material_Request_Message_Type_Enum.AdditionalConditions
		);

		const motivationEvent = deniedEvent ?? approvedEvent;
		const motivation = (
			motivationEvent?.body as MaterialRequestMessageBodyStatusUpdateWithMotivation
		)?.motivation;

		const conditions = (
			additionalConditionsEvent?.body as MaterialRequestMessageBodyAdditionalConditions
		)?.conditions;

		if (!motivation && !conditions?.length) {
			return;
		}

		this.h2(
			doc,
			contentWidth,
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___motivatie',
				{},
				locale
			)
		);

		if (motivation) {
			this.text(doc, contentWidth, motivation);
			doc.moveDown(0.5);
		}

		if (conditions?.length) {
			for (const condition of conditions) {
				const conditionTypeLabel =
					GET_MATERIAL_REQUEST_EXTRA_CONDITION_LABELS[condition.type] ?? condition.type;
				this.h3(doc, contentWidth, conditionTypeLabel);
				this.text(doc, contentWidth, condition.text);
				doc.moveDown(0.5);
			}
		}
	}

	/**
	 * Generate PDF for a material request
	 * @param materialRequest The material request with all the reuse form values
	 * @returns Buffer containing the PDF data
	 */
	private async generateReuseFormPdf(materialRequest: MaterialRequest): Promise<Buffer> {
		const locale = Locale.Nl;
		const [doc, pdfBufferPromise, margin, contentWidth] = this.setupPdfDoc(
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___synthese-jouw-aanvraag-tot-hergebruik',
				{},
				locale
			),
			locale
		);

		const labels = this.getTranslatedLabels(materialRequest, Locale.Nl);

		// h1 — page title
		this.h1(
			doc,
			contentWidth,
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___synthese-jouw-aanvraag-tot-hergebruik',
				{},
				locale
			)
		);

		// h2 — Info about the material request
		this.addGeneralMaterialRequestInfo(doc, contentWidth, materialRequest, locale);

		// h2 — Selected form fields
		this.h2(
			doc,
			contentWidth,
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___geselecteerde-formulierwaarden',
				{},
				locale
			)
		);

		for (const field of labels) {
			this.h3(doc, contentWidth, field.label);
			this.text(doc, contentWidth, field.value);
			doc.moveDown(0.5);
		}

		this.addPageNumbers(doc, margin, contentWidth);

		doc.flushPages();
		doc.end();
		return pdfBufferPromise;
	}

	private formatDateWithTime(value?: string | null): string {
		if (!value) return '-';

		const date = parseISO(value);
		if (!isValid(date)) return value;

		return format(date, 'dd/MM/yyyy HH:mm');
	}

	/**
	 * Generate the final summary PDF for a material request (sent when the request reaches a terminal status)
	 */
	private async generateFinalSummaryPdf(materialRequest: MaterialRequest): Promise<Buffer> {
		const locale = Locale.Nl;
		const [doc, pdfBufferPromise, margin, contentWidth] = this.setupPdfDoc(
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___synthese-jouw-aanvraag-tot-hergebruik',
				{},
				locale
			),
			locale
		);

		// h1 — page title
		this.h1(
			doc,
			contentWidth,
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___synthese-jouw-aanvraag-tot-hergebruik',
				{},
				locale
			)
		);

		// h2 — Info about the material request
		this.addGeneralMaterialRequestInfo(doc, contentWidth, materialRequest, locale);

		// h2 — Status log
		this.h2(
			doc,
			contentWidth,
			this.translationsService.tText(
				'modules/material-request-messages/services/material-request-pdf-generator___status-log',
				{},
				locale
			)
		);

		const col1Width = contentWidth * 0.4;
		const col2Width = contentWidth * 0.6;

		const requestedAtLabel = this.translationsService.tText(
			'modules/account/components/material-request-detail-blade/material-request-detail-blade___aangevraagd-op',
			{
				requestedAt: this.formatDateWithTime(
					materialRequest.requestedAt || materialRequest.createdAt
				),
			},
			locale
		);

		const historyRows: [string, string][] = [
			[requestedAtLabel, `${materialRequest.requesterFullName} (${materialRequest.requesterMail})`],
			...materialRequest.history
				.map((event): [string, string] => [
					this.mapEventToStatusLabel(event, materialRequest, locale),
					`${event.senderProfile.fullName} (${event.senderProfile.mail}`,
				])
				.filter(([label]) => !!label),
		];

		let tableY = doc.y;
		tableY += this.renderTableRow(
			doc,
			margin,
			tableY,
			[
				{
					text: this.translationsService.tText(
						'modules/material-request-messages/services/material-request-pdf-generator___status',
						{},
						locale
					),
					width: col1Width,
				},
				{
					text: this.translationsService.tText(
						'modules/material-request-messages/services/material-request-pdf-generator___uitgevoerd-door',
						{},
						locale
					),
					width: col2Width,
				},
			],
			true
		);

		for (const [status, performer] of historyRows) {
			if (tableY + 30 > doc.page.height - margin) {
				doc.addPage();
				tableY = margin;
			}
			tableY += this.renderTableRow(
				doc,
				margin,
				tableY,
				[
					{ text: status, width: col1Width },
					{ text: performer, width: col2Width },
				],
				false
			);
		}

		doc.y = tableY;
		doc.moveDown(1.5);

		// Motivation / additional conditions (only shown if applicable)
		this.addMotivationSection(doc, contentWidth, materialRequest, locale);

		this.addPageNumbers(doc, margin, contentWidth);

		doc.flushPages();
		doc.end();
		return pdfBufferPromise;
	}

	public async generateReuseFormPdfAndUpload(materialRequest: MaterialRequest): Promise<string> {
		const pdfBuffer = await this.generateReuseFormPdf(materialRequest);

		const fileName = `${randomUUID()}.pdf`;
		return await this.assetsService.uploadAndTrack(
			AvoFileUploadAssetType.MATERIAL_REQUEST_MESSAGE_ATTACHMENT,
			{
				originalname: fileName,
				buffer: pdfBuffer,
			},
			materialRequest.requesterId,
			fileName
		);
	}

	public async generateFinalSummaryPdfAndUpload(materialRequest: MaterialRequest): Promise<string> {
		const pdfBuffer = await this.generateFinalSummaryPdf(materialRequest);

		const fileName = `${randomUUID()}.pdf`;
		return await this.assetsService.uploadAndTrack(
			AvoFileUploadAssetType.MATERIAL_REQUEST_MESSAGE_ATTACHMENT,
			{
				originalname: fileName,
				buffer: pdfBuffer,
			},
			materialRequest.requesterId,
			fileName
		);
	}
}
