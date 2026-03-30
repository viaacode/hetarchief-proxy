import { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { AssetsService, TranslationsService } from '@meemoo/admin-core-api';
import { Injectable } from '@nestjs/common';
import { AvoFileUploadAssetType } from '@viaa/avo2-types';
import { format, isValid, parseISO } from 'date-fns';
import PDFDocument from 'pdfkit';
import { GET_REUSE_LABELS } from '~modules/material-request-messages/material-request-messages.const';
import {
	MaterialRequest,
	MaterialRequestReuseFormKey,
	MaterialRequestType,
} from '~modules/material-requests/material-requests.types';

const FONTS_DIR = join(__dirname, '../../../assets/fonts/sofia-pro');
const FONT_REGULAR = join(FONTS_DIR, 'sofia-pro-regular.woff');
const FONT_BOLD = join(FONTS_DIR, 'sofia-pro-bold.woff');
const FONT_ITALIC = join(FONTS_DIR, 'sofia-pro-regular-italic.woff');

const COLORS = {
	title: '#00857d',
	text: '#222222',
	muted: '#888888',
};

@Injectable()
export class MaterialRequestPdfGeneratorService {
	constructor(
		private translationsService: TranslationsService,
		private assetsService: AssetsService
	) {}

	private formatDate(value?: string | null): string {
		if (!value) return '-';

		const date = parseISO(value);
		if (!isValid(date)) return value;

		return format(date, 'dd/MM/yyyy');
	}

	private formatSeconds(totalSeconds?: number | null): string {
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
	 * Returns the translated values for the text in the pdf using the same keys as the frontend,
	 * so we hopefully don't have to add these translations twice
	 * @param request The material request containing the reuse form with the values to get the labels for.
	 * @private
	 */
	private getTranslatedLabels(request: MaterialRequest): Array<{ label: string; value: string }> {
		const { reuseForm } = request;
		const LABELS = GET_REUSE_LABELS(this.translationsService);

		return [
			{
				label: this.translationsService.tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___materiaalselectie'
				),
				value:
					reuseForm.durationType === 'PARTIAL'
						? `${this.formatSeconds(reuseForm.startTime)} - ${this.formatSeconds(reuseForm.endTime)}`
						: this.translationsService.tText('Volledig materiaal'),
			},
			{
				label: this.translationsService.tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___downloadkwaliteit-label'
				),
				value: LABELS[MaterialRequestReuseFormKey.downloadQuality][reuseForm.downloadQuality],
			},
			{
				label: this.translationsService.tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-label'
				),
				value: LABELS[MaterialRequestReuseFormKey.intendedUsage][reuseForm.intendedUsage],
			},
			{
				label: this.translationsService.tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-beschrijving-label'
				),
				value: reuseForm.intendedUsageDescription?.trim() || '-',
			},
			{
				label: this.translationsService.tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___ontsluiting-materiaal-label'
				),
				value: LABELS[MaterialRequestReuseFormKey.distributionAccess][reuseForm.distributionAccess],
			},
			{
				label: this.translationsService.tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-label'
				),
				value: LABELS[MaterialRequestReuseFormKey.distributionType][reuseForm.distributionType],
			},
			{
				label: this.translationsService.tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___wijziging-materiaal-label'
				),
				value: LABELS[MaterialRequestReuseFormKey.materialEditing][reuseForm.materialEditing],
			},
			{
				label: this.translationsService.tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___geografisch-gebruik-label'
				),
				value: LABELS[MaterialRequestReuseFormKey.geographicalUsage][reuseForm.geographicalUsage],
			},
			{
				label: this.translationsService.tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___gebruik-in-de-tijd-label'
				),
				value: LABELS[MaterialRequestReuseFormKey.timeUsageType][reuseForm.timeUsageType],
			},
			{
				label: this.translationsService.tText(
					'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bronvermelding-label'
				),
				value: LABELS[MaterialRequestReuseFormKey.copyrightDisplay][reuseForm.copyrightDisplay],
			},
		];
	}

	private GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE(): Record<MaterialRequestType, string> {
		return {
			[MaterialRequestType.MORE_INFO]: this.translationsService.tText(
				'modules/material-requests/const/material-requests___type-more-info'
			),
			[MaterialRequestType.REUSE]: this.translationsService.tText(
				'modules/material-requests/const/material-requests___type-reuse'
			),
			[MaterialRequestType.VIEW]: this.translationsService.tText(
				'modules/material-requests/const/material-requests___type-view'
			),
		};
	}

	private h1(doc: PDFKit.PDFDocument, contentWidth: number, text: string): void {
		doc
			.font('SofiaProBold')
			.fontSize(22)
			.fillColor(COLORS.title)
			.text(text, { width: contentWidth });
		doc.moveDown(0.75);
	}

	private h2(doc: PDFKit.PDFDocument, contentWidth: number, text: string): void {
		doc
			.font('SofiaProBold')
			.fontSize(13)
			.fillColor(COLORS.text)
			.text(text, { width: contentWidth });
		doc.moveDown(0.5);
	}

	private h3(doc: PDFKit.PDFDocument, contentWidth: number, text: string): void {
		doc
			.font('SofiaProBold')
			.fontSize(11)
			.fillColor(COLORS.text)
			.text(text, { width: contentWidth });
	}

	private text(doc: PDFKit.PDFDocument, contentWidth: number, value: string): void {
		doc
			.font('SofiaProItalic')
			.fontSize(10)
			.fillColor(COLORS.text)
			.text(value || '-', { width: contentWidth });
	}

	private greyText(doc: PDFKit.PDFDocument, contentWidth: number, value: string): void {
		doc
			.font('SofiaProItalic')
			.fontSize(10)
			.fillColor(COLORS.muted)
			.text(value || '-', { width: contentWidth });
	}

	private addGeneralMaterialRequestInfo(
		doc: PDFKit.PDFDocument,
		contentWidth: number,
		materialRequest: MaterialRequest
	): void {
		const fragmentSelection =
			materialRequest.reuseForm?.durationType === 'PARTIAL'
				? `${this.formatSeconds(materialRequest.reuseForm.startTime)} - ${this.formatSeconds(materialRequest.reuseForm.endTime)}`
				: this.translationsService.tText('Volledig materiaal');

		// h2 — Gegevens over jouw aanvraag
		this.h2(doc, contentWidth, this.translationsService.tText('Gegevens over jouw aanvraag'));

		this.h3(doc, contentWidth, this.translationsService.tText('Materiaal'));
		this.text(doc, contentWidth, materialRequest.objectSchemaName);
		this.greyText(doc, contentWidth, materialRequest.objectSchemaIdentifier);
		this.greyText(doc, contentWidth, materialRequest.maintainerName);
		this.greyText(doc, contentWidth, fragmentSelection);
		doc.moveDown(0.5);

		this.h3(doc, contentWidth, this.translationsService.tText('Type aanvraag'));
		this.text(
			doc,
			contentWidth,
			this.GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE()[materialRequest.type]
		);
		doc.moveDown(0.5);

		this.h3(doc, contentWidth, this.translationsService.tText('Aanvrager'));
		this.text(doc, contentWidth, materialRequest.requesterFullName);
		this.greyText(doc, contentWidth, materialRequest.requesterMail);
		doc.moveDown(0.5);

		this.h3(doc, contentWidth, this.translationsService.tText('Organisatie'));
		this.text(doc, contentWidth, materialRequest.requesterOrganisation);
		if (materialRequest.requesterOrganisationSector) {
			this.greyText(doc, contentWidth, materialRequest.requesterOrganisationSector);
		}
		doc.moveDown(0.5);

		this.h3(doc, contentWidth, this.translationsService.tText('Naam aanvraag'));
		this.text(doc, contentWidth, materialRequest.requestGroupName);
		doc.moveDown(1.5);
	}

	/**
	 * Generate PDF for a material request
	 * @param materialRequest The material request with all the reuse form values
	 * @returns Buffer containing the PDF data
	 */
	private async generateReuseFormPdf(materialRequest: MaterialRequest): Promise<Buffer> {
		const doc = new PDFDocument({
			size: 'A4',
			margin: 50,
			bufferPages: true,
			info: {
				Title: 'Synthese: jouw aanvraag tot hergebruik',
				Author: 'meemoo',
				Subject: 'Synthese: jouw aanvraag tot hergebruik',
			},
		});

		doc.registerFont('SofiaProBold', FONT_BOLD);
		doc.registerFont('SofiaProRegular', FONT_REGULAR);
		doc.registerFont('SofiaProItalic', FONT_ITALIC);

		const chunks: Buffer[] = [];
		doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

		const pdfBufferPromise = new Promise<Buffer>((resolve, reject) => {
			doc.on('end', () => resolve(Buffer.concat(chunks)));
			doc.on('error', reject);
		});

		const margin = 50;
		const contentWidth = doc.page.width - margin * 2;

		const fragmentSelection =
			materialRequest.reuseForm?.durationType === 'PARTIAL'
				? `${this.formatSeconds(materialRequest.reuseForm.startTime)} - ${this.formatSeconds(materialRequest.reuseForm.endTime)}`
				: this.translationsService.tText('Volledig materiaal');

		const labels = this.getTranslatedLabels(materialRequest);

		// h1 — page title
		this.h1(doc, contentWidth, 'Synthese: jouw aanvraag tot hergebruik');

		// General information
		this.addGeneralMaterialRequestInfo(doc, contentWidth, materialRequest);

		// h2 — Geselecteerde formulierwaarden
		this.h2(doc, contentWidth, this.translationsService.tText('Geselecteerde formulierwaarden'));

		for (const field of labels) {
			this.h3(doc, contentWidth, field.label);
			this.text(doc, contentWidth, field.value);
			doc.moveDown(0.5);
		}

		// Stamp page numbers on all buffered pages
		const { start, count } = doc.bufferedPageRange();
		for (let i = start; i < start + count; i++) {
			doc.switchToPage(i);
			const oldBottomMargin = doc.page.margins.bottom;
			doc.page.margins.bottom = 0;
			doc
				.font('SofiaProRegular')
				.fontSize(9)
				.fillColor(COLORS.muted)
				.text(`${i - start + 1} / ${count}`, margin, doc.page.height - 30, {
					width: contentWidth,
					align: 'right',
					lineBreak: false,
				});
			doc.page.margins.bottom = oldBottomMargin;
		}

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
}
