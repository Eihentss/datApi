import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Code2 } from "lucide-react";
import Navbar from "@/Components/Navbar";
export default function Docx(auth) {

    return (
        <>
            <Head title="API Builder Dokumentācija" />
            <div className="min-h-screen bg-gray-50 text-black">
                {/* Navbar */}
                    <Navbar auth={auth} />

                {/* Main Content */}
                <div className="pt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-8 text-center">
                        API Builder Dokumentācija
                    </h1>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Ievads</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Šī platforma ļauj jums izveidot savu API bez
                            programmēšanas zināšanām.
                        </p>
                    </section>

                    {/* Route */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Route</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Route nosaka unikālu URL jūsu API resursam. Tam
                            jābūt formātā:
                            <code className="bg-black text-white px-1 rounded">
                                /mans-api
                            </code>
                            .
                        </p>
                        <ul className="list-disc ml-6 mt-2 text-gray-700">
                            <li>
                                Obligāti jāuzsāk ar{" "}
                                <code className="bg-black text-white px-1 rounded">
                                    /
                                </code>
                            </li>
                            <li>
                                Var saturēt tikai burtus, ciparus, '-' vai '_'
                            </li>
                            <li>Max garums: 255 rakstzīmes</li>
                        </ul>
                    </section>

                    {/* Privāts / Publisks */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">
                            Privāts / Publisks
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Privāts API</strong> – piekļuve tikai Jums
                            (autentifikācija nepieciešama).
                            <br />
                            <strong>Publisks API</strong> – pieejams ikvienam ar
                            unikālu URL.
                        </p>
                    </section>

                    {/* Metodes */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">
                            Atļautās metodes
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Katram API resursam varat izvēlēties, kuras HTTP
                            metodes ir atļautas:
                        </p>
                        <ul className="list-disc ml-6 mt-2 text-gray-700">
                            <li>
                                <strong>GET</strong> – iegūst datus no API
                            </li>
                            <li>
                                <strong>POST</strong> – pievieno jaunus datus
                            </li>
                            <li>
                                <strong>PUT</strong> – atjauno esošos datus
                            </li>
                            <li>
                                <strong>DELETE</strong> – dzēš datus
                            </li>
                        </ul>
                    </section>

                    {/* Datu formāts */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">
                            Datu formāts
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Jūsu API var atgriezt datus šādos formātos:
                        </p>
                        <ul className="list-disc ml-6 mt-2 text-gray-700">
                            <li>
                                <strong>JSON</strong> – strukturēti dati ar
                                atslēgām un vērtībām.
                            </li>
                            <li>
                                <strong>XML</strong> – hierarhiska datu
                                struktūra.
                            </li>
                            <li>
                                <strong>CSV</strong> – teksta tabula ar kolonām.
                            </li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                            Piemērs JSON formātam:
                        </p>
                        <pre className="bg-black text-green-400 p-4 rounded-lg overflow-x-auto mt-2">
                            {`{
                                "users": [
                                    {
                                    "id": 1,
                                    "name": "Jānis Bērziņš",
                                    "email": "janis@example.com"
                                    }
                                ]
                                }`}
                        </pre>
                    </section>

                    {/* Ieteikumi */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">
                            Ieteikumi API izstrādei
                        </h2>
                        <ul className="list-disc ml-6 mt-2 text-gray-700">
                            <li>
                                Vienmēr pārbaudiet JSON, lai izvairītos no
                                kļūdām.
                            </li>
                            <li>
                                Izvēlieties viegli saprotamus route nosaukumus.
                            </li>
                            <li>
                                Privātajiem API vienmēr izmantojiet
                                autentifikāciju.
                            </li>
                            <li>
                                Pārliecinieties, ka vismaz viena metode ir
                                atļauta katram API resursam.
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </>
    );
}
