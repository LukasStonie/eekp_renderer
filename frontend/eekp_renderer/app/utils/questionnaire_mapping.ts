export default function () {

    const mapping: any = [
        {
            url: 'https://dev.elga.gv.at//apis/eekp-fhir-anbindung/v0.1.0/reference/static/V3_Geburt_Schwangere.R4.json',
            title: 'Geburt Schwangere',
            questionnaireReference: "https://fhir.hl7.at/eekp/Questionnaire/GS"
        },
        {
            url: 'https://dev.elga.gv.at//apis/eekp-fhir-anbindung/v0.1.0/reference/static/V3_Das-Neugeborene-nach-der-Geburt.R4.json',
            title: 'Geburt Kind',
            questionnaireReference: "https://fhir.hl7.at/eekp/Questionnaire/NG"
        },
        { 
            url: 'https://dev.elga.gv.at//apis/eekp-fhir-anbindung/v0.1.0/reference/static/V3_Postpartale-Periode.R4.json', 
            title: 'Postpartale Periode',
            questionnaireReference: "https://fhir.hl7.at/eekp/Questionnaire/PP"
        },
        { 
            url: 'https://dev.elga.gv.at//apis/eekp-fhir-anbindung/v0.1.0/reference/static/V3_Zustand-des-Kindes-bei-Entlassung_Transfer.R4.json', 
            title: 'Zustand des Kindes bei Entlassung/Transfer',
            questionnaireReference: "https://fhir.hl7.at/eekp/Questionnaire/EK" 
        },
    ]

    return mapping;
}