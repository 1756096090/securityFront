import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './service/apis.service';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { ExportService } from './service/export.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Priority {
  [key: string]: string;
}

interface CategoryPriority {
  default: string;
  priorities: Priority;
}

@Component({
  selector: 'app-assets-scan',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatPaginatorModule
  ],
  templateUrl: './assets-scan.component.html',
  styleUrls: ['./assets-scan.component.sass'],
  providers: [ApiService]
})
export class AssetsScanComponent implements OnInit {
  domain: string | null = '';
  certificates: any[] = [];
  dnsRecords: any[] = [];
  analysisResults: any[] = [];
  website: any[] = [];
  mails: any[] = [];
  services: any[] = [];

  displayedColumnsCertificates: string[] = ['indice', 'nombre', 'descripcion', 'valido_desde', 'valido_hasta', 'emisor', 'sujeto', 'encriptacion', 'prioridad', 'valor'];
  displayedColumnsDnsRecords: string[] = ['indice', 'tipo', 'ttl', 'prioridad', 'valor'];
  displayedColumnsMails: string[] = ['indice', 'email', 'name', 'prioridad', 'valor'];
  displayedColumnsServices: string[] = ['indice', 'service', 'prioridad', 'valor'];
  displayedColumnsWebsites: string[] = ['indice', 'type', 'url', 'prioridad', 'valor'];
  displayedColumnsAnalysisResults: string[] = ['indice', 'engine', 'category', 'result', 'prioridad', 'valor'];

  certificatesPage: any[] = [];
  dnsRecordsPage: any[] = [];
  analysisResultsPage: any[] = [];
  websitesPage: any[] = [];
  mailsPage: any[] = [];
  servicesPage: any[] = [];

  certificatesPageSize = 5;
  dnsRecordsPageSize = 5;
  analysisResultsPageSize = 5;
  websitesPageSize = 5;
  mailsPageSize = 5;
  servicesPageSize = 5;

  certificatesPageIndex = 0;
  dnsRecordsPageIndex = 0;
  analysisResultsPageIndex = 0;
  websitesPageIndex = 0;
  mailsPageIndex = 0;
  servicesPageIndex = 0;

  categoryPriorities: { [key: string]: CategoryPriority } = {
    certificates: {
      default: 'Media',
      priorities: {}
    },
    dnsRecords: {
      default: 'Baja',
      priorities: {}
    },
    analysisResults: {
      default: 'Baja',
      priorities: {}
    },
    websites: {
      default: 'Media',
      priorities: {
        twitter: 'Baja',
        facebook: 'Baja',
        linkedin: 'Alta',
        instagram: 'Media',
        youtube: 'Media'
      }
    },
    mails: {
      default: 'Media',
      priorities: {}
    },
    services: {
      default: 'Media',
      priorities: {
        apache: 'Alta',
        facebook: 'Media',
        'google-analytics': 'Media',
        'google-tag-manager': 'Media',
        hotjar: 'Media',
        leaflet: 'Media',
        mysql: 'Alta',
        php: 'Alta',
        react: 'Alta',
        'w3-total-cache': 'Baja',
        wordpress: 'Alta',
        'yoast-seo': 'Media'
      }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.domain = params.get('domain');
    });
    this.initialize()
  }

  initialize(){


      if (this.domain) {
        this.apiService.getVirusTotalInfo(this.domain).subscribe({
          next: (info) => {
            this.certificates = this.assignPriorities(info.assets.certificates, 'certificates');
            this.dnsRecords = this.assignPriorities(info.assets.dns_records, 'dnsRecords');
            this.analysisResults = this.assignPriorities(info.assets.analysis_results, 'analysisResults');
            this.updateCertificatesPage();
            this.updateDnsRecordsPage();
            this.updateAnalysisResultsPage();
          },
          error: (error) => {
            console.error('Error:', error);
          }
        });

        this.apiService.getDomainInfo(this.domain).subscribe({
          next: (info) => {
            this.website = this.assignPriorities(this.transformWebsiteData(info.websites), 'websites');
            this.mails = this.assignPriorities(info.mails, 'mails');
            this.services = this.assignPriorities(this.transformServicesData(info.servicesAndPrograms), 'services');
            this.updateWebsitesPage();
            this.updateMailsPage();
            this.updateServicesPage();
          },
          error: (error) => {
            console.error('Error:', error);
          }
        });
      }


  }

  transformServicesData(services: any): any[] {
    return services.map((service: any) => ({ service }));
  }

  transformWebsiteData(websites: any): any[] {
    const result: any[] = [];
    for (const key in websites) {
      if (key === 'personalWebsites') {
        for (const person in websites[key]) {
          websites[key][person].forEach((url: string) => {
            result.push({ type: person, url });
          });
        }
      } else {
        result.push({ type: key, url: websites[key] });
      }
    }
    return result;
  }

  assignPriorities(data: any[], category: string): any[] {
    const categoryPriority = this.categoryPriorities[category] || { default: 'Media', priorities: {} };
    return data.map(item => {
      const itemKey = item.type || item.service || item.email || item.name;
      const priority = categoryPriority.priorities[itemKey] || categoryPriority.default;
      return { ...item, prioridad: priority };
    });
  }

  updateCertificatesPage() {
    const startIndex = this.certificatesPageIndex * this.certificatesPageSize;
    const endIndex = startIndex + this.certificatesPageSize;
    this.certificatesPage = this.certificates.slice(startIndex, endIndex).map((item, index) => ({ ...item, indice: startIndex + index + 1 }));
  }

  updateDnsRecordsPage() {
    const startIndex = this.dnsRecordsPageIndex * this.dnsRecordsPageSize;
    const endIndex = startIndex + this.dnsRecordsPageSize;
    this.dnsRecordsPage = this.dnsRecords.slice(startIndex, endIndex).map((item, index) => ({ ...item, indice: startIndex + index + 1 }));
  }

  updateAnalysisResultsPage() {
    const startIndex = this.analysisResultsPageIndex * this.analysisResultsPageSize;
    const endIndex = startIndex + this.analysisResultsPageSize;
    this.analysisResultsPage = this.analysisResults.slice(startIndex, endIndex).map((item, index) => ({ ...item, indice: startIndex + index + 1 }));
  }

  updateWebsitesPage() {
    const startIndex = this.websitesPageIndex * this.websitesPageSize;
    const endIndex = startIndex + this.websitesPageSize;
    this.websitesPage = this.website.slice(startIndex, endIndex).map((item, index) => ({ ...item, indice: startIndex + index + 1 }));
  }

  updateMailsPage() {
    const startIndex = this.mailsPageIndex * this.mailsPageSize;
    const endIndex = startIndex + this.mailsPageSize;
    this.mailsPage = this.mails.slice(startIndex, endIndex).map((item, index) => ({ ...item, indice: startIndex + index + 1 }));
  }

  updateServicesPage() {
    const startIndex = this.servicesPageIndex * this.servicesPageSize;
    const endIndex = startIndex + this.servicesPageSize;
    this.servicesPage = this.services.slice(startIndex, endIndex).map((item, index) => ({ ...item, indice: startIndex + index + 1 }));
  }

  onCertificatesPageChange(event: any) {
    this.certificatesPageIndex = event.pageIndex;
    this.certificatesPageSize = event.pageSize;
    this.updateCertificatesPage();
  }

  onDnsRecordsPageChange(event: any) {
    this.dnsRecordsPageIndex = event.pageIndex;
    this.dnsRecordsPageSize = event.pageSize;
    this.updateDnsRecordsPage();
  }

  onAnalysisResultsPageChange(event: any) {
    this.analysisResultsPageIndex = event.pageIndex;
    this.analysisResultsPageSize = event.pageSize;
    this.updateAnalysisResultsPage();
  }

  onWebsitesPageChange(event: any) {
    this.websitesPageIndex = event.pageIndex;
    this.websitesPageSize = event.pageSize;
    this.updateWebsitesPage();
  }

  onMailsPageChange(event: any) {
    this.mailsPageIndex = event.pageIndex;
    this.mailsPageSize = event.pageSize;
    this.updateMailsPage();
  }

  onServicesPageChange(event: any) {
    this.servicesPageIndex = event.pageIndex;
    this.servicesPageSize = event.pageSize;
    this.updateServicesPage();
  }

  exportCertificates() {
    this.exportService.exportAsExcelFile(this.certificatesPage, 'certificates');
  }

  exportDnsRecords() {
    this.exportService.exportAsExcelFile(this.dnsRecordsPage, 'dns_records');
  }

  exportAnalysisResults() {
    this.exportService.exportAsExcelFile(this.analysisResultsPage, 'analysis_results');
  }

  exportWebsites() {
    this.exportService.exportAsExcelFile(this.websitesPage, 'websites');
  }

  exportMails() {
    this.exportService.exportAsExcelFile(this.mailsPage, 'mails');
  }

  exportServices() {
    this.exportService.exportAsExcelFile(this.servicesPage, 'services');
  }
}
