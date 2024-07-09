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

@Component({
  selector: 'app-assets-scan',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule, MatTableModule,
    MatSelectModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    FormsModule,
    MatPaginatorModule // Asegúrate de importar MatPaginatorModule
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
  website: any[] = [] ;
  mails: any[] = [];
  services: any[] = [];

  displayedColumnsCertificates: string[] = ['indice', 'nombre', 'descripcion', 'valido_desde', 'valido_hasta', 'emisor', 'sujeto', 'encriptacion', 'prioridad', 'valor'];
  displayedColumnsDnsRecords: string[] = ['indice', 'tipo', 'ttl', 'prioridad', 'valor'];
  displayedColumnsMails: string[] = ['indice', 'email', 'name'];
  displayedColumnsServices: string[] = ['indice', 'service'];
  displayedColumnsWebsites: string[] = ['indice', 'type', 'url'];
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

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.domain = params.get('domain');

      if (this.domain) {
        this.apiService.getVirusTotalInfo(this.domain).subscribe({
          next: (info) => {
            this.certificates = this.sortByPriority(info.assets.certificates);
            this.dnsRecords = this.sortByPriority(info.assets.dns_records);
            this.analysisResults = this.sortByPriority(info.assets.analysis_results);
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
            console.log("🚀 ~ AssetsScanComponent ~ this.apiService.getDomainInfo ~ info:", info)
            this.website = this.transformWebsiteData(info.websites);
            this.mails = info.mails;
            this.services = info.servicesAndPrograms;

          },
          error: (error) => {
            console.error('Error:', error);
          }
        });
      }
    });
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

  sortByPriority(data: any[]): any[] {
    const priorityMap: { [key: string]: number } = { 'Alta': 1, 'Media': 2, 'Baja': 3 };
    return data.sort((a, b) => (priorityMap[a.prioridad] || 4) - (priorityMap[b.prioridad] || 4));
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
    this.exportService.exportAsExcelFile(this.certificates, 'certificates');
  }

  exportDnsRecords() {
    this.exportService.exportAsExcelFile(this.dnsRecords, 'dns_records');
  }

  exportAnalysisResults() {
    this.exportService.exportAsExcelFile(this.analysisResults, 'analysis_results');
  }

  exportWebsites() {
    this.exportService.exportAsExcelFile(this.website, 'websites');
  }

  exportMails() {
    this.exportService.exportAsExcelFile(this.mails,'mails');
  }
  exportServices() {
    this.exportService.exportAsExcelFile(this.services,'services');
  }

}
