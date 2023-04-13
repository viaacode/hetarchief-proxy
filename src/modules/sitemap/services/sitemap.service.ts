import { DataService } from '@meemoo/admin-core-api';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SitemapService {
	constructor(protected dataService: DataService) {}
}
