import dotenv from "dotenv";
import OpenAI from "openai";
import ChatbotDemo from "@/components/chatbotDemo";

dotenv.config();

export default async function Home() {
  const client = new OpenAI();

  const response = await client.responses.create({
    model: "gpt-4o",
    user: "agent",
    input: `Eres un agente de seguros que clasifica pacientes según su historial médico y estilo de vida, usando los datos del siguiente paciente. Tu tarea es identificar qué productos están disponibles para este paciente, según una base de conocimiento de aseguradoras y sus criterios.
    Devuelve los nombres de productos disponibles, compañía, tipo de seguro y razón por la cual califican(o no).
    Base de productos:
      {
  "products": [
    {
      "company": "AIG",
      "product": "GIWL",
      "type": "Guaranteed Issue Whole Life",
      "eligibility": {
        "smoker": true,
        "cardiac_surgery": true,
        "requires_medical_exam": false,
        "waiting_period": "2 years",
        "underwriting_level": "guaranteed"
      }
    },
    {
      "company": "Mutual of Omaha",
      "product": "Living Promise",
      "type": "Simplified Issue Whole Life",
      "eligibility": {
        "smoker": true,
        "cardiac_surgery": false,
        "requires_medical_exam": false,
        "waiting_period": "0 years if accepted",
        "underwriting_level": "simplified"
      }
    }
  ]
}

      Paciente:
{
  "age": 65,
  "sex": "male",
  "smoker": true,
  "alcohol_use": false,
  "conditions": ["cardiac surgery", "hypertension"],
  "medications": ["atenolol"],
  "surgery_history": ["coronary artery bypass"],
  "preferred_insurance_type": "Final Expense"
}
Respuesta esperada:
{
  "eligible_products": [
    {
      "company": "AIG",
      "product": "GIWL",
      "reason": "Producto garantizado sin underwriting, permite fumadores y cirugías cardíacas."
    },
    {
      "company": "Great Western",
      "product": "GAP",
      "reason": "No requiere historial médico. Ideal para pacientes con condiciones severas."
    }
  ],
  "not_eligible_products": [
    {
      "company": "Mutual of Omaha",
      "product": "Living Promise",
      "reason": "No se acepta cirugía cardíaca en el historial médico reciente."
    }
  ]
}

`,
  });

  console.log(response);


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ChatbotDemo />
        <h1>{response.output_text}</h1>
      </main >
    </div >
  );
}
