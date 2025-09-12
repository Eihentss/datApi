import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Navbar from "@/Components/Navbar";

import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ resource, mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <Head title="Rediģēt API" />
            
            <Navbar />

            <div className="pt-24 max-w mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold leading-tight text-black">
                            Rediģēt profilu
                        </h2>
                    </div>

                    {/* Vienmēr rādam profila informācijas update formu */}
                    <div className="bg-white border border-black p-4 shadow-lg sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            resource={resource}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Ja lietotājs NAV ar Google loginu (google_id nav) — rādām paroles un dzēšanas formas */}
                    {user.isgoogle == 0 && (
                        <>
                            <div className="bg-white border border-black p-4 shadow-lg sm:rounded-lg sm:p-8">
                                <UpdatePasswordForm 
                                    resource={resource}
                                    className="max-w-xl" 
                                />
                            </div>

                            <div className="bg-white border border-black p-4 shadow-lg sm:rounded-lg sm:p-8">
                                <DeleteUserForm 
                                    resource={resource}
                                    className="max-w-xl" 
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
