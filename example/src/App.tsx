import { useState } from 'react';
import './App.css';
import { Sidebar, SectionId } from './components/Sidebar';
import { EnvironmentSection } from './components/sections/EnvironmentSection';
import { CategoriesSection } from './components/sections/CategoriesSection';
import { ProductsSection } from './components/sections/ProductsSection';
import { CustomersSection } from './components/sections/CustomersSection';
import { CartSection } from './components/sections/CartSection';
import { OrdersSection } from './components/sections/OrdersSection';
import { RefundsSection } from './components/sections/RefundsSection';
import { PaymentsSection } from './components/sections/PaymentsSection';
import { SystemSection } from './components/sections/SystemSection';
import { IntegrationSection } from './components/sections/IntegrationSection';
import { ExamplesSection } from './components/sections/ExamplesSection';

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('environment');
  const isInIframe = window.self !== window.top;

  const renderSection = () => {
    switch (activeSection) {
      case 'environment':
        return <EnvironmentSection isInIframe={isInIframe} />;
      case 'categories':
        return <CategoriesSection isInIframe={isInIframe} />;
      case 'products':
        return <ProductsSection isInIframe={isInIframe} />;
      case 'customers':
        return <CustomersSection isInIframe={isInIframe} />;
      case 'cart':
        return <CartSection isInIframe={isInIframe} />;
      case 'orders':
        return <OrdersSection isInIframe={isInIframe} />;
      case 'refunds':
        return <RefundsSection isInIframe={isInIframe} />;
      case 'payments':
        return <PaymentsSection isInIframe={isInIframe} />;
      case 'system':
        return <SystemSection isInIframe={isInIframe} />;
      case 'integration':
        return <IntegrationSection isInIframe={isInIframe} />;
      case 'examples':
        return <ExamplesSection isInIframe={isInIframe} />;
      default:
        return <EnvironmentSection isInIframe={isInIframe} />;
    }
  };

  return (
    <div className="app">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="app__main">
        <div className="app__header">
          <h1 className="app__title">Commands Frame Example</h1>
          <div className="app__status">
            <span className={`app__status-indicator ${isInIframe ? 'app__status-indicator--active' : ''}`}></span>
            <span className="app__status-text">
              {isInIframe ? 'Running in iframe' : 'Not in iframe'}
            </span>
          </div>
        </div>
        <div className="app__content">
          {renderSection()}
          </div>
      </div>
    </div>
  );
}

export default App;
