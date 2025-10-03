import { Head, usePage, useForm } from '@inertiajs/react';
import Navbar from "@/Components/Navbar";

export default function Edit({ resource, mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    // Profile form
    const { data: profile, setData: setProfile, put: updateProfile, processing: profileProcessing, errors: profileErrors } = useForm({
        name: user.name || "",
        email: user.email || "",
    });

    // Password form
    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: passwordProcessing, errors: passwordErrors } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    // Delete form
    const { data: deleteData, setData: setDeleteData, delete: destroy, processing: deleteProcessing, errors: deleteErrors } = useForm({
        password: "",
    });

    function handleProfileSubmit(e) {
        e.preventDefault();
        updateProfile(route("profile.update"));
    }

    function handlePasswordSubmit(e) {
        e.preventDefault();
        updatePassword(route("password.update"));
    }

    function handleDelete(e) {
        e.preventDefault();
        if (!confirm("Vai tiešām dzēst profilu?")) return;

        destroy(route("profile.destroy"), {
            data: deleteData, // šeit sūtām paroli
            method: 'delete', // obligāti
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <Head title="Rediģēt profilu" />
            
            <Navbar />

            <div className="pt-24 max-w mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold leading-tight text-black">
                            Rediģēt profilu
                        </h2>
                    </div>

                    {/* Profile update */}
                    <div className="bg-white border border-black p-4 shadow-lg sm:rounded-lg sm:p-8">
                        <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
                            <div>
                                <label className="block font-semibold">Vārds</label>
                                <input 
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile("name", e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                                {profileErrors.name && <p className="text-red-600 text-sm">{profileErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block font-semibold">E-pasts</label>
                                <input 
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile("email", e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                                {profileErrors.email && <p className="text-red-600 text-sm">{profileErrors.email}</p>}
                            </div>
                            <button disabled={profileProcessing} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                                Saglabāt
                            </button>
                        </form>
                    </div>

                    {/* Password update */}
                    {user.isgoogle == 0 && (
                        <div className="bg-white border border-black p-4 shadow-lg sm:rounded-lg sm:p-8">
                            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
                                <div>
                                    <label className="block font-semibold">Pašreizējā parole</label>
                                    <input 
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData("current_password", e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    {passwordErrors.current_password && <p className="text-red-600 text-sm">{passwordErrors.current_password}</p>}
                                </div>
                                <div>
                                    <label className="block font-semibold">Jaunā parole</label>
                                    <input 
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData("password", e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    {passwordErrors.password && <p className="text-red-600 text-sm">{passwordErrors.password}</p>}
                                </div>
                                <div>
                                    <label className="block font-semibold">Apstiprināt paroli</label>
                                    <input 
                                        type="password"
                                        value={passwordData.password_confirmation}
                                        onChange={(e) => setPasswordData("password_confirmation", e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                                <button disabled={passwordProcessing} type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                                    Mainīt paroli
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Delete user */}
                    {user.isgoogle == 0 && (
                        <div className="bg-white border border-black p-4 shadow-lg sm:rounded-lg sm:p-8">
                            <form onSubmit={handleDelete} className="max-w-xl space-y-4">
                                <p className="mb-4 text-red-600">
                                    Uzmanību! Šī darbība neatgriezeniski dzēsīs jūsu kontu.
                                </p>
                                <div>
                                    <label className="block font-semibold">Pašreizējā parole</label>
                                    <input
                                        type="password"
                                        value={deleteData.password}
                                        onChange={(e) => setDeleteData("password", e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    {deleteErrors.password && (
                                        <p className="text-red-600 text-sm">{deleteErrors.password}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={deleteProcessing}
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Dzēst kontu
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
