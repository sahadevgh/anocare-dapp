import AnocareChat from '@/app/components/ChatWindow';
import { Header } from '@/app/components/Header';
import Footer from '@/app/components/homepage/Footer';
import React from 'react';

const AnoAIPage: React.FC = () => {
    return (
        <div>
            <Header />
            <AnocareChat />
            <Footer />
        </div>
    );
};

export default AnoAIPage;