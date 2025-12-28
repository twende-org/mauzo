// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
export default function MainLayout() {
    const navigate = useNavigate();

    const handleOnclick = () => {
        navigate('/login');
    }
    return (
        <div className="min-h-screen">
            {/* Optional: Navbar for main site */}
            <header className="h-96 bg-primary flex flex-col items-center justify-center text-white rounded-b-lg shadow-sm text-center px-4">
                <h1 className="text-4xl font-bold mb-2">MauzoPlus</h1>

                <p className="max-w-2xl text-lg opacity-90 mb-6">
                    Mfumo wa kisasa wa POS wa kudhibiti mauzo, bidhaa na ripoti za biashara yako
                </p>

                <Button variant="secondary" onClick={handleOnclick}>
                    Ingia Kwenye Mfumo
                </Button>
            </header>


            <main className="flex-1 p-6">
                <div className="max-w-6xl mx-auto">
                    <Outlet /> {/* Renders child routes */}
                </div>
            </main>


            <footer className="bg-gray-100 p-4 text-center">
                &copy; {new Date().getFullYear()} My hobiet project. All rights reserved.
            </footer>
        </div>
    );
}
