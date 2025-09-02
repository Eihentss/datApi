import { Head } from "@inertiajs/react";
import { useState } from "react";
import {
    Code2,
    Database,
    Lock,
    Unlock,
    Zap,
    Globe,
    ArrowRight,
    Check,
    Star,
    Users,
    Shield,
    Rocket,
} from "lucide-react";
import { usePage } from "@inertiajs/react";
export default function Welcome({ auth }) {
    const [hoveredFeature, setHoveredFeature] = useState(null);
    const [activeTab, setActiveTab] = useState("json");

    const handleClick = () => {
        if (auth.user) {
            window.location.href = "/Create";
        } else {
            window.location.href = "/login";
        }
    };

    const features = [
        {
            icon: <Code2 className="w-8 h-8" />,
            title: "Bez programmēšanas",
            description:
                "Izveidojiet API ar vienkāršām formām. Nav nepieciešamas programmēšanas zināšanas.",
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Automātiska ģenerācija",
            description:
                "Routes un endpoints tiek ģenerēti automātiski pēc jūsu specifikācijas.",
        },
        {
            icon: <Database className="w-8 h-8" />,
            title: "Fleksīga datu struktūra",
            description:
                "Atbalsts JSON un citiem datu formātiem. Pilnībā pielāgojams.",
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Privātums un drošība",
            description:
                "Izvēlieties starp publiskām un privātām API. Pilna kontrole pār piekļuvi.",
        },
    ];

    const apiExamples = {
        json: `{
  "users": [
    {
      "id": 1,
      "name": "Jānis Bērziņš",
      "email": "janis@example.com",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "Anna Kalniņa", 
      "email": "anna@example.com",
      "role": "user"
    }
  ]
}`,
    };

    return (
        <>
            <Head title="API Builder - Izveidojiet savu API bez programmēšanas" />
            <div className="min-h-screen bg-white text-black">
                {/* Navigation */}
                <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm fixed w-full z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                    <Code2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">
                                    API Builder
                                </span>
                            </div>
                            <div className="flex items-center">
                                {auth?.user ? (
                                    <div className="text-black font-medium">
                                        Sveiks, {auth.user.name}!
                                    </div>
                                ) : (
                                    <button className="text-gray-700 hover:text-black font-medium transition-colors"
                                      onClick={handleClick}
                                    >   
                                  

                                        Piereģistrēties
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-24 pb-16 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="mb-8">
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                                Izveidojiet savu
                                <span className="block bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                                    API bez koda
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                                Unikāla platforma, kas ļauj jums izveidot
                                personalizētu API, izmantojot vienkāršas formas.
                                Bez programmēšanas zināšanām. Bez sarežģījumiem.
                                Tikai rezultāts.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button
                                    onClick={handleClick}
                                    className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-all transform hover:scale-105 flex items-center"
                                >
                                    Sākt
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">
                                    Ātrs
                                </div>
                                <div className="text-gray-600">
                                    API izveides laiks
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">
                                    0%
                                </div>
                                <div className="text-gray-600">
                                    Programmēšanas zināšanas
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">∞</div>
                                <div className="text-gray-600">Iespējas</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">
                                Kāpēc izvēlēties API Builder?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Mēs padarām API izveidi tik vienkāršu, ka to var
                                izdarīt ikviens
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`bg-white p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                                        hoveredFeature === index
                                            ? "border-black shadow-xl transform -translate-y-2"
                                            : "border-gray-200"
                                    }`}
                                    onMouseEnter={() =>
                                        setHoveredFeature(index)
                                    }
                                    onMouseLeave={() => setHoveredFeature(null)}
                                >
                                    <div className="mb-4 text-black">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section id="how-it-works" className="py-20">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">
                                Kā tas darbojas?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Trīs vienkārši soļi līdz jūsu API
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">
                                            Definējiet datu struktūru
                                        </h3>
                                        <p className="text-gray-600">
                                            Ievadiet savus datus JSON formātā
                                            vai izvēlieties citu piemērotu
                                            struktūru. Mūsu intuitīvais
                                            redaktors palīdzēs jums.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">
                                            Konfigurējiet API
                                        </h3>
                                        <p className="text-gray-600">
                                            Norādiet, vai jūsu API būs publisks
                                            vai privāts. Sistēma automātiski
                                            ģenerēs visus nepieciešamos
                                            endpoints.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">
                                            Izmantojiet un testējiet
                                        </h3>
                                        <p className="text-gray-600">
                                            Jūsu API ir gatavs lietošanai!
                                            Saņemiet unikālu URL un sāciet
                                            integrēt savās aplikācijās.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 rounded-2xl p-6">
                                <div className="flex space-x-2 mb-4">
                                    <button
                                        onClick={() => setActiveTab("json")}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            activeTab === "json"
                                                ? "bg-white text-black"
                                                : "text-gray-400 hover:text-white"
                                        }`}
                                    >
                                        JSON
                                    </button>
                                </div>
                                <pre className="text-white text-sm overflow-x-auto">
                                    <code>{apiExamples[activeTab]}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* API Functionality */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">
                                API funkcionalitāte
                            </h2>
                            <p className="text-xl text-gray-600">
                                Pilnvērtīgs API ar visām nepieciešamajām
                                funkcijām
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
                                <Globe className="w-8 h-8 mb-4" />
                                <h3 className="text-xl font-semibold mb-3">
                                    RESTful endpoints
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                            GET
                                        </span>
                                        <span>/api/your-resource</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            POST
                                        </span>
                                        <span>/api/your-resource</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                            PUT
                                        </span>
                                        <span>/api/your-resource/:id</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                                            DELETE
                                        </span>
                                        <span>/api/your-resource/:id</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
                                <Shield className="w-8 h-8 mb-4" />
                                <h3 className="text-xl font-semibold mb-3">
                                    Drošība
                                </h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center">
                                        <Check className="w-4 h-4 mr-2 text-green-500" />{" "}
                                        API atslēgas
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="w-4 h-4 mr-2 text-green-500" />{" "}
                                        Rate limiting
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="w-4 h-4 mr-2 text-green-500" />{" "}
                                        CORS atbalsts
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="w-4 h-4 mr-2 text-green-500" />{" "}
                                        HTTPS šifrēšana
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
                                <Rocket className="w-8 h-8 mb-4" />
                                <h3 className="text-xl font-semibold mb-3">
                                    Papildu funkcijas
                                </h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center">
                                        <Check className="w-4 h-4 mr-2 text-green-500" />{" "}
                                        Datu validācija
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="w-4 h-4 mr-2 text-green-500" />{" "}
                                        Automātiska dokumentācija
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="w-4 h-4 mr-2 text-green-500" />{" "}
                                        Real-time monitorings
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="w-4 h-4 mr-2 text-green-500" />{" "}
                                        Webhook atbalsts
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}

                {/* Footer */}
                <footer className="border-t border-gray-200 py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                    <Code2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">
                                    API Builder
                                </span>
                            </div>
                            <div className="text-gray-600 text-center md:text-right">
                                <p>&copy; 2025 API Builder.</p>
                                <p className="text-sm mt-1">
                                    Izveidoja Ričards Eihentāls
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
