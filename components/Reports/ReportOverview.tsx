"use client";
import React from 'react';
import WCLineChartV2 from '@/components/Location/WCLineChartV2';
import WCBarChartV2 from '@/components/Location/WCBarChartV2';
import ChartAnalysisV2 from '@/components/Location/ChartAnalysisV2';
import { useQuery } from '@tanstack/react-query'
import Image from "next/image";
import { usePDF } from 'react-to-pdf';
import { useSearchParams } from 'next/navigation'
interface Props {
    city_name: string,
    country_name: string,
    industry: string,
    company_name: string
}

export default function Overview(){
  const searchParams = useSearchParams()
  const city_name = searchParams.get("city_name") || "New York"
  const country_name = searchParams.get("country_name") || "united states"
  const industry = searchParams.get("industry") || "finance"
  const company_name = searchParams.get("company_name") || "Test Company"
  const mock_data = searchParams.get("mock") || false
    // const hostname = process.env.NEXT_PUBLIC_RISKAI_HOST
    const hostname = "https://walrus-app-24aml.ondigitalocean.app"
    const pdfName = `TheWorldClimate Risk Analysis - ${company_name}.pdf`
    const { toPDF, targetRef } = usePDF({filename: pdfName});
    var location = {
      city_name: city_name,
      country_name: country_name
    }
    const {isPending, error, data} = useQuery({
        queryKey: ['report'],
        queryFn: () =>
        fetch(`${hostname}/generate`, {
                signal: AbortSignal.timeout(60000),
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({location:location, industry: industry, secret: process.env.NEXT_PUBLIC_RISKAI_SECRET, mock: mock_data})
        }).then((res) =>
            
            res.json(),
         ),
    })
    if (isPending) return <img src="/images/loading-spinner.svg" className="m-auto"/>
    if (error) return 'An error has occurred: ' + error.message
    const riskMitigationData = JSON.parse(data.risk_results);
    const risks = riskMitigationData.map((result:any) =>
    <li key={result.risk} className="px-4 py-2 bg-white border-b last:border-none border-black-200">
        {result.risk}
    </li>);
    const mitigations = riskMitigationData.map((result:any) =>
      <li key={result.mitigation} className="px-4 py-2 bg-white border-b last:border-none border-black-200">
    {result.mitigation}
</li>);
    const line_charts = data.locations_results.analyses.map((analysis:any) =>
      analysis.query_type.chart_type === 'line' ?
      <div key={analysis.query_type.name} className="charting-overview">
          <div className="charting-block">
            <WCLineChartV2 chartData={JSON.parse(analysis.climate_data).data} query_type={analysis.query_type.name}/>
          </div>
          <ChartAnalysisV2 summary={analysis.summary}/>
        </div> : ""
      );
    const bar_charts = data.locations_results.analyses.map((analysis:any) =>
      analysis.query_type.chart_type === 'bar' ?
      <div key={analysis.query_type.name} className="charting-overview">
          <div className="charting-block">
          <WCBarChartV2 chartData={JSON.parse(analysis.climate_data).data} query_type={analysis.query_type.name} />
          </div>
          <ChartAnalysisV2 summary={analysis.summary}/>
        </div> : ""
      );

    return (
    <div>
      <button className="outline-black outline text-black focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 m-5" onClick={() => toPDF()}>Download PDF</button>
      <div ref={targetRef}>
          <div  className="col-span-2">
            <header className='text-center py-10'>
          <div className="flex justify-center items-center">          
              <Image
            src={"/images/logo-transparent copy.png"}
            alt="logo"
            width={128}
            height={128}
            className="w-32 h-32"/>
            
          </div>

          <h1 className="py-10 text-4xl font-bold text-center">TheWorldClimate RiskAI Analysis</h1>
          <h1 className="text-4xl font-bold text-center">{company_name}</h1>
        </header>
        <section className="box features pt-10">
          <h2 className="major"><span>Climate Related Industry Risks</span></h2>
          <div className="grid grid-cols-2 justify-content-center">
            <div>
            <h3 className="text-center">Industry Risks</h3>
              {risks}
            </div>
            <div>
            <h3 className="text-center">Industry Risk Mitigations</h3>
              {mitigations}
              </div>
          </div>
        </section>
        <section className="box features pt-10">
          <h2 className="major"><span>Climate Analysis - {city_name.replace('-', ' ')}</span></h2>
        </section>
        
          </div>
      <div className="container m-auto grid grid-cols-1 xl:grid-cols-2 gap-4">
        {line_charts}
        {bar_charts}
      </div>
      <section className="box features pt-10">
        <h2 className="major"><span></span></h2>
      </section>
    </div>
    </div>)
}