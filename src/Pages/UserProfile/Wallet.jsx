import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdAccountBalanceWallet } from "react-icons/md";
import { ApiAuthContext } from "../../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../../Components/Loader";



export default function Wallet() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { baseUrl, XApiKey } = useContext(ApiAuthContext);
    async function getWallets() {
        const headers = {
            "X-API-KEY": XApiKey,
            Authorization: "Bearer " + localStorage.getItem("token"),
        };

        const response = await axios.get(`${baseUrl}/wallets`, {
            headers,
        });

 
        return response.data.data;
    }

    const { data: wallet, isError, error, isLoading, isFetching } = useQuery({
        queryKey: ["Wallets"],
        queryFn: getWallets,
    });

    // read parent outlet context (if provided)
    const outletContext = useOutletContext();
    const { setWalletInfo } = outletContext || {};

    useEffect(() => {
        if (wallet && setWalletInfo) {
            try {
                const symbol = wallet?.converted?.symbol_en ?? null;
                const balance = wallet?.converted?.converted_balance ?? null;
                setWalletInfo({ symbol, balance });
            } catch (err) {
                // ignore safely if shape differs
            }
        }
    }, [wallet, setWalletInfo]);

    if (isLoading) {
        return <Loader />;
    }
    if (!wallet) return <p className="text-sm text-gray-300">{t('profile.No wallet found.')}</p>;

    return (
        <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
                <MdAccountBalanceWallet size={20} /> {t('profile.Wallet')}
            </h3>

            <div className="bg-third text-white p-4 rounded-lg my-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h4 className="font-bold text-lg">{t('profile.Balance')}</h4>
                        <p className="text-2xl font-extrabold">
                            {wallet.converted.symbol_en} {wallet.converted.converted_balance}
                        </p>
                    </div>

                </div>

                <div className="border-t border-gray-500 pt-4">
                    <h4 className="font-bold mb-3">{t('profile.Transactions')}</h4>

                    {wallet.transactions && wallet.transactions.length > 0 ? (
                        wallet.transactions.map((txn) => (
                            <div
                                key={txn.id}
                                className="flex items-center justify-between gap-4 border-1 p-3 rounded-lg border-gray-500 my-3 bg-[#2f3b3b]"
                            >
                                <div>
                                    <p className="text-sm text-gray-300">{txn.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${txn.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                        {txn.type === 'credit' ? '+' : '-'} {txn.converted.symbol_en}{txn.converted.converted_amount}
                                    </p>
                                    <p className="text-sm text-gray-300">{txn.created_at}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-300">{t('profile.No transactions found.')}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
