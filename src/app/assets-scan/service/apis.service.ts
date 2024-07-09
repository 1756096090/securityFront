import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000/api';  // Ajusta esto según tu configuración

  constructor(private http: HttpClient) { }

  getVirusTotalInfo(domain: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/virustotal-info/${domain}`).pipe(
      map(info => {
        info.assets.analysis_results = info.assets.analysis_results.map((result: { category: string; result: string; }) => {
          return {
            ...result,
            category: this.translateCategory(result.category),
            result: this.translateResult(result.result)
          };
        });
        return info;
      })
    );
  }

  getDomainInfo(domain: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/domain-info/${domain}`);
  }

  private translateCategory(category: string): string {
    const translations: { [key: string]: string } = {
      'harmless': 'inofensivo',
      'undetected': 'no detectado'
    };
    return translations[category] || category;
  }

  private translateResult(result: string): string {
    const translations: { [key: string]: string } = {
      'clean': 'limpio',
      'unrated': 'sin calificar'
    };
    return translations[result] || result;
  }
}
