import { Injectable } from '@nestjs/common';

import i18n from '~shared/i18n';

@Injectable()
export class AppService {
	getHello(): string {
		return i18n.t('app___hello-world');
	}
}
