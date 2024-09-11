import { XMarkIcon } from '@heroicons/react/24/solid'; // Adjusted to the correct path for version 16 as per your instruction
import React, { useState, useEffect } from 'react';

const CookiePreferences = () => {
    const [strictlyNecessary, setStrictlyNecessary] = useState(true);
    const [analytics, setAnalytics] = useState(false);
    const [functional, setFunctional] = useState(false);
    const [advertising, setAdvertising] = useState(false);
    const [social, setSocial] = useState(false);

    const [showStrictlyNecessary, setShowStrictlyNecessary] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showFunctional, setShowFunctional] = useState(false);
    const [showAdvertising, setShowAdvertising] = useState(false);
    const [showSocial, setShowSocial] = useState(false);

    const [isPopupVisible, setIsPopupVisible] = useState(true);

    useEffect(() => {
        // Check if the popup has already been shown
        const hasSeenPopup = localStorage.getItem('cookiePreferencesSeen');
        if (!hasSeenPopup) {
            setIsPopupVisible(true);
        }
    }, []);

    const handleSavePreferences = () => {
        console.log('Preferences saved');
        localStorage.setItem('cookiePreferencesSeen', 'true'); // Store that the popup has been shown
        setIsPopupVisible(false); // Hide popup when preferences are saved
    };

    const handleClose = () => {
        console.log('Preferences modal closed');
        localStorage.setItem('cookiePreferencesSeen', 'true'); // Store that the popup has been shown
        setIsPopupVisible(false); // Hide popup when close button is clicked
    };

    if (!isPopupVisible) return null; // Render nothing if popup is not visible

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg relative">
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-bold mb-4">Centre de préférences de la confidentialité</h2>
                <p className="text-gray-700 mb-6">
                    Lorsque vous consultez un site Web, des données peuvent être stockées dans votre navigateur ou récupérées
                    à partir de celui-ci, généralement sous la forme de cookies. Ces informations peuvent porter sur vous,
                    sur vos préférences ou sur votre appareil et sont principalement utilisées pour s'assurer que le site
                    Web fonctionne correctement. Les informations ne permettent généralement pas de vous identifier
                    directement, mais peuvent vous permettre de bénéficier d'une expérience Web personnalisée. Parce que nous
                    respectons votre droit à la vie privée, nous vous donnons la possibilité de ne pas autoriser certains
                    types de cookies. Cliquez sur les différentes catégories pour obtenir plus de détails sur chacune
                    d'entre elles, et modifier les paramètres par défaut.
                </p>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center">
                            <button onClick={() => setShowStrictlyNecessary(!showStrictlyNecessary)}>
                                {showStrictlyNecessary ? '-' : '+'}
                            </button>
                            <h3 className="text-lg font-semibold">Cookies strictement nécessaires</h3>
                            <span className="text-blue-500">Toujours actif</span>
                        </div>
                        {showStrictlyNecessary && (
                            <p className="text-sm text-gray-600 mt-2">
                                Ces cookies sont nécessaires au bon fonctionnement du site Web et ne peuvent pas être désactivés.
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center">
                            <button onClick={() => setShowAnalytics(!showAnalytics)}>
                                {showAnalytics ? '-' : '+'}
                            </button>
                            <h3 className="text-lg font-semibold">Cookies d'analyse</h3>
                            <input
                                type="checkbox"
                                checked={analytics}
                                onChange={() => setAnalytics(!analytics)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                                title="Analytics"
                            />
                        </div>
                        {showAnalytics && (
                            <p className="text-sm text-gray-600 mt-2">
                                Ces cookies collectent des informations sur la manière dont vous utilisez le site Web, afin d'améliorer votre expérience.
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center">
                            <button onClick={() => setShowFunctional(!showFunctional)}>
                                {showFunctional ? '-' : '+'}
                            </button>
                            <h3 className="text-lg font-semibold">Cookies de fonctionnalité ou de personnalisation</h3>
                            <input
                                type="checkbox"
                                checked={functional}
                                onChange={() => setFunctional(!functional)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                                title="Functional Cookies"
                            />
                        </div>
                        {showFunctional && (
                            <p className="text-sm text-gray-600 mt-2">
                                Ces cookies permettent au site Web de se souvenir des choix que vous faites pour offrir une expérience plus personnalisée.
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center">
                            <button onClick={() => setShowAdvertising(!showAdvertising)}>
                                {showAdvertising ? '-' : '+'}
                            </button>
                            <h3 className="text-lg font-semibold">Cookies de publicité comportementale</h3>
                            <input
                                type="checkbox"
                                checked={advertising}
                                onChange={() => setAdvertising(!advertising)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                                title="Advertising Cookies"
                            />
                        </div>
                        {showAdvertising && (
                            <p className="text-sm text-gray-600 mt-2">
                                Ces cookies sont utilisés pour afficher des publicités adaptées à vos centres d'intérêt.
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center">
                            <button onClick={() => setShowSocial(!showSocial)}>
                                {showSocial ? '-' : '+'}
                            </button>
                            <h3 className="text-lg font-semibold">Cookies « réseaux sociaux »</h3>
                            <input
                                type="checkbox"
                                checked={social}
                                onChange={() => setSocial(!social)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                                title="Social Media Cookies"
                            />
                        </div>
                        {showSocial && (
                            <p className="text-sm text-gray-600 mt-2">
                                Ces cookies permettent de partager du contenu directement sur les réseaux sociaux.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSavePreferences}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                    >
                        Confirmer la sélection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookiePreferences;
