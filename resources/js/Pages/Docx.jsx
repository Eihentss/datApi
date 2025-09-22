import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Code2, Shield, Globe, Database, Activity, AlertCircle, CheckCircle, Copy } from "lucide-react";
import Navbar from "@/Components/Navbar";


export default function Docx({ auth }) {
    const [copiedCode, setCopiedCode] = useState('');

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(''), 2000);
    };

    const CodeBlock = ({ children, language = "json", copyId }) => (
        <div className="relative">
            <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto mt-2 text-sm border border-gray-600">
                <code>{children}</code>
            </pre>
            {copyId && (
                <button
                    onClick={() => copyToClipboard(children, copyId)}
                    className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                >
                    {copiedCode === copyId ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            )}
        </div>
    );

    return (
        <>
            <Head title="API Builder Dokumentācija" />
            <div className="min-h-screen bg-gray-50 text-white">
                <Navbar auth={auth} />

                <div className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4 text-black">
                            API Builder Dokumentācija
                        </h1>
                        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                            Izveidojiet un pārvaldiet savus API endpoints bez programmēšanas zināšanām
                        </p>
                    </div>

                    {/* Quick Start */}
                    <section className="mb-12 bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center mb-4">
                            <Code2 className="w-6 h-6 text-black mr-3" />
                            <h2 className="text-3xl font-semibold text-black">Ātrais sākums</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            API Builder ļauj jums izveidot REST API endpoints ar dažiem klikšķiem. Katrs API var atgriezt datus JSON, XML vai YAML formātā un atbalsta visas galvenās HTTP metodes.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                                <h3 className="font-semibold text-black mb-2">1. Izveidojiet API</h3>
                                <p className="text-sm text-gray-600">Norādiet route, formātu un atļaujas</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                                <h3 className="font-semibold text-black mb-2">2. Konfigurējiet datus</h3>
                                <p className="text-sm text-gray-600">Definējiet JSON schema jūsu datiem</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                                <h3 className="font-semibold text-black mb-2">3. Izmantojiet API</h3>
                                <p className="text-sm text-gray-600">Piekļūstiet saviem datiem caur HTTP</p>
                            </div>
                        </div>
                    </section>

                    {/* Route Configuration */}
                    <section className="mb-12 bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-semibold mb-4 flex items-center text-black">
                            <Globe className="w-6 h-6 text-black mr-3" />
                            Route konfigurācija
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Route nosaka unikālu URL jūsu API resursam. Tas ir galvenais identifikators, kas ļauj piekļūt jūsu API.
                        </p>

                        <div className="bg-gray-100 p-6 rounded-lg mb-4 border border-gray-300">
                            <h3 className="font-semibold mb-3 text-black">Formāts un prasības:</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-black mr-2 mt-0.5 flex-shrink-0" />
                                    Obligāti jāuzsāk ar <code className="bg-gray-200 px-2 py-1 rounded text-sm text-black">/</code>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-black mr-2 mt-0.5 flex-shrink-0" />
                                    Var saturēt tikai burtus, ciparus, <code className="bg-gray-200 px-2 py-1 rounded text-sm text-black">-</code> vai <code className="bg-gray-200 px-2 py-1 rounded text-sm text-black">_</code>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-black mr-2 mt-0.5 flex-shrink-0" />
                                    Maksimālais garums: 255 rakstzīmes
                                </li>
                                <li className="flex items-start">
                                    <AlertCircle className="w-5 h-5 text-black mr-2 mt-0.5 flex-shrink-0" />
                                    Nevar sākties ar <code className="bg-gray-200 px-2 py-1 rounded text-sm text-black">/api</code> (rezervēts sistēmai)
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gray-100 border-l-4 border-black p-4 mb-4">
                            <h4 className="font-semibold text-black mb-2">Piemēri:</h4>
                            <ul className="text-gray-700 space-y-1">
                                <li>✅ <code>/users</code> - vienkāršs un skaidrs</li>
                                <li>✅ <code>/my-data</code> - ar defisi</li>
                                <li>✅ <code>/product_catalog</code> - ar apakšsvītru</li>
                                <li>❌ <code>/api/users</code> - nevar sākties ar /api</li>
                                <li>❌ <code>users</code> - jāsākas ar /</li>
                            </ul>
                        </div>
                    </section>

                    {/* Visibility & Security */}
                    <section className="mb-12 bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-semibold mb-4 flex items-center text-black">
                            <Shield className="w-6 h-6 text-black mr-3" />
                            Drošība un piekļuve
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-black mb-3">Publisks API</h3>
                                <ul className="text-gray-700 space-y-2">
                                    <li>• Pieejams ikvienam internetā</li>
                                    <li>• Nav nepieciešama autentifikācija</li>
                                    <li>• Ideāls publiski pieejamiem datiem</li>
                                    <li>• Redzams publisko API sarakstā</li>
                                </ul>
                            </div>

                            <div className="bg-gray-200 border border-gray-400 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-black mb-3">Privāts API</h3>
                                <ul className="text-gray-600 space-y-2">
                                    <li>• Piekļuve tikai ar paroli</li>
                                    <li>• Aizsargāti sensitīvi dati</li>
                                    <li>• Īpašnieks var piekļūt bez paroles</li>
                                    <li>• Parole obligāta izveidošanas laikā</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 bg-gray-100 p-6 rounded-lg border border-gray-300">
                            <h4 className="font-semibold mb-3 text-black">Privātā API autentifikācija:</h4>
                            <p className="text-gray-700 mb-3">Paroli var nodot divos veidos:</p>
                            <CodeBlock copyId="auth-query">
                                {`// 1. Kā URL parametru
GET /jūsu-route?password=jūsu_parole

// 2. Kā HTTP header
X-API-PASSWORD: jūsu_parole`}
                            </CodeBlock>
                        </div>
                    </section>

                    {/* HTTP Methods */}
                    <section className="mb-12 bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-semibold mb-4 flex items-center text-black">
                            <Activity className="w-6 h-6 text-black mr-3" />
                            HTTP metodes
                        </h2>

                        <p className="text-gray-700 mb-6">
                            Katram API varat izvēlēties, kuras HTTP metodes ir atļautas. Sistēma automātiski apstrādās datu operācijas.
                        </p>

                        <div className="grid gap-4">
                            <div className="border border-gray-300 bg-gray-100 rounded-lg p-6">
                                <div className="flex items-center mb-3">
                                    <span className="bg-black text-white px-3 py-1 rounded text-sm font-bold mr-3">GET</span>
                                    <h3 className="text-lg font-semibold text-black">Datu iegūšana</h3>
                                </div>
                                <p className="text-gray-700 mb-3">Atgriež visus saglabātos datus no API schema.</p>
                                <CodeBlock copyId="get-example">
                                    {`GET /jūsu-route
Response: JSON/XML/YAML ar visiem datiem`}
                                </CodeBlock>
                            </div>

                            <div className="border border-gray-300 bg-gray-100 rounded-lg p-6">
                                <div className="flex items-center mb-3">
                                    <span className="bg-black text-white px-3 py-1 rounded text-sm font-bold mr-3">POST</span>
                                    <h3 className="text-lg font-semibold text-black">Datu pievienošana</h3>
                                </div>
                                <p className="text-gray-700 mb-3">Pievieno jaunus datus esošajiem. Dati tiek sapludināti ar schema.</p>
                                <CodeBlock copyId="post-example">
                                    {`POST /jūsu-route
Content-Type: application/json

{
  "name": "Jānis",
  "email": "janis@example.com"
}`}
                                </CodeBlock>
                            </div>

                            <div className="border border-gray-300 bg-gray-100 rounded-lg p-6">
                                <div className="flex items-center mb-3">
                                    <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">PUT</span>
                                    <h3 className="text-lg font-semibold text-black">Datu aizstāšana</h3>
                                </div>
                                <p className="text-gray-700 mb-3">Pilnībā aizstāj visus datus ar jaunajiem.</p>
                                <CodeBlock copyId="put-example">
                                    {`PUT /jūsu-route
Content-Type: application/json

{
  "users": [
    {"id": 1, "name": "Jānis Updated"}
  ]
}`}
                                </CodeBlock>
                            </div>

                            <div className="border border-gray-300 bg-gray-100 rounded-lg p-6">
                                <div className="flex items-center mb-3">
                                    <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-bold mr-3">DELETE</span>
                                    <h3 className="text-lg font-semibold text-black">Datu dzēšana</h3>
                                </div>
                                <p className="text-gray-700 mb-3">Dzēš visus datus no API schema.</p>
                                <CodeBlock copyId="delete-example">
                                    {`DELETE /jūsu-route
Response: {"message": "All data deleted successfully"}`}
                                </CodeBlock>
                            </div>
                        </div>
                    </section>

                    {/* Data Formats */}
                    <section className="mb-12 bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-semibold mb-4 flex items-center text-black">
                            <Database className="w-6 h-6 text-black mr-3" />
                            Datu formāti
                        </h2>

                        <p className="text-gray-700 mb-6">
                            Jūsu API var atgriezt datus dažādos formātos. Formāts tiek norādīts API izveidošanas laikā.
                        </p>

                        <div className="space-y-6">
                            <div className="border border-gray-300 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-black">JSON (JavaScript Object Notation)</h3>
                                <p className="text-gray-700 mb-3">Populārākais formāts web API. Viegli lasāms un apstrādājams.</p>
                                <CodeBlock copyId="json-example">
                                    {`{
  "users": [
    {
      "id": 1,
      "name": "Jānis Bērziņš",
      "email": "janis@example.com",
      "active": true
    },
    {
      "id": 2,
      "name": "Anna Ozola",
      "email": "anna@example.com",
      "active": false
    }
  ],
  "total": 2,
  "lastUpdated": "2024-01-15T10:30:00Z"
}`}
                                </CodeBlock>
                            </div>

                            <div className="border border-gray-300 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-black">XML (eXtensible Markup Language)</h3>
                                <p className="text-gray-700 mb-3">Strukturēts formāts ar tagiem. Bieži izmantots uzņēmuma sistēmās.</p>
                                <CodeBlock language="xml" copyId="xml-example">
                                    {`<?xml version="1.0" encoding="UTF-8"?>
<root>
  <users>
    <item0>
      <id>1</id>
      <name>Jānis Bērziņš</name>
      <email>janis@example.com</email>
      <active>true</active>
    </item0>
    <item1>
      <id>2</id>
      <name>Anna Ozola</name>
      <email>anna@example.com</email>
      <active>false</active>
    </item1>
  </users>
  <total>2</total>
</root>`}
                                </CodeBlock>
                            </div>

                            <div className="border border-gray-300 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-3 text-black">YAML (YAML Ain't Markup Language)</h3>
                                <p className="text-gray-700 mb-3">Cilvēkam draudzīgs formāts ar atkāpēm. Bieži izmantots konfigurācijas failos.</p>
                                <CodeBlock language="yaml" copyId="yaml-example">
                                    {`users:
  - id: 1
    name: 'Jānis Bērziņš'
    email: janis@example.com
    active: true
  - id: 2
    name: 'Anna Ozola'
    email: anna@example.com
    active: false
total: 2
lastUpdated: '2024-01-15T10:30:00Z'`}
                                </CodeBlock>
                            </div>
                        </div>
                    </section>

                    {/* Rate Limiting & Monitoring */}
                    <section className="mb-12 bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-semibold mb-4 text-black">Ierobežojumi un uzraudzība</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-black mb-3">Rate Limiting</h3>
                                <ul className="text-gray-700 space-y-2">
                                    <li>• Maksimāli 1 pieprasījums ik pēc 3 sekundēm uz IP</li>
                                    <li>• Aizsargā pret pārslodzi</li>
                                    <li>• HTTP 429 kods, ja pārsniegts limits</li>
                                    <li>• Attiecas uz katru API atsevišķi</li>
                                </ul>
                            </div>

                            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-black mb-3">Statistika</h3>
                                <ul className="text-gray-700 space-y-2">
                                    <li>• Kopējais pieprasījumu skaits</li>
                                    <li>• Sadalījums pa HTTP metodēm</li>
                                    <li>• Pēdējo 7 dienu aktivitāte</li>
                                    <li>• Kļūdu žurnāls (pēdējās 50)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Best Practices */}
                    <section className="mb-12 bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-semibold mb-4 text-black">Labākās prakses</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Ieteicams darīt
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• Izvēlieties skaidrus un loģiskus route nosaukumus</li>
                                    <li>• Vienmēr validējiet JSON sintaksi</li>
                                    <li>• Izmantojiet paroles privātajiem API</li>
                                    <li>• Regulāri pārbaudiet statistiku</li>
                                    <li>• Dokumentējiet savu API struktūru</li>
                                    <li>• Testējiet API pirms publiskošanas</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    Izvairieties no
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• Sensitīvu datu glabāšanas publiskos API</li>
                                    <li>• Vāju paroļu izmantošanas</li>
                                    <li>• Pārāk sarežģītu route nosaukumu</li>
                                    <li>• JSON ar sintakses kļūdām</li>
                                    <li>• API bez nevienas atļautas metodes</li>
                                    <li>• Paroļu koplietošanas</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Common Error Codes */}
                    <section className="mb-12 bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-semibold mb-4 text-black">Biežākie kļūdu kodi</h2>

                        <div className="space-y-4">
                            <div className="flex items-start p-4 bg-gray-100 rounded-lg border border-gray-300">
                                <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-bold mr-4">404</span>
                                <div>
                                    <h4 className="font-semibold text-black">API not found</h4>
                                    <p className="text-gray-600">Norādītais route neeksistē vai nav pareizi uzrakstīts.</p>
                                </div>
                            </div>

                            <div className="flex items-start p-4 bg-gray-100 rounded-lg border border-gray-300">
                                <span className="bg-gray-700 text-white px-3 py-1 rounded text-sm font-bold mr-4">403</span>
                                <div>
                                    <h4 className="font-semibold text-black">Unauthorized / Method not allowed</h4>
                                    <p className="text-gray-600">Nepareiza parole vai HTTP metode nav atļauta.</p>
                                </div>
                            </div>

                            <div className="flex items-start p-4 bg-gray-100 rounded-lg border border-gray-300">
                                <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-bold mr-4">429</span>
                                <div>
                                    <h4 className="font-semibold text-black">Too Many Requests</h4>
                                    <p className="text-gray-600">Pārsniegts rate limit. Uzgaidiet 3 sekundes pirms nākamā pieprasījuma.</p>
                                </div>
                            </div>


                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}