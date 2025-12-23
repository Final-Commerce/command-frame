import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface CategoriesSectionProps {
  isInIframe: boolean;
}

export function CategoriesSection({ isInIframe: _ }: CategoriesSectionProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string>('');

  const handleGetCategories = async () => {
    // if (!isInIframe) {
    //   setCategoriesError('Error: Not running in iframe');
    //   return;
    // }

    setCategoriesLoading(true);
    setCategories([]);
    setCategoriesError('');

    try {
      const result = await command.getCategories({});
      
      if (result && typeof result === 'object') {
        if (result.categories && Array.isArray(result.categories)) {
          setCategories(result.categories);
        } else {
          setCategoriesError(`Invalid response format. Expected categories array, got: ${JSON.stringify(result).substring(0, 100)}`);
        }
      } else {
        setCategoriesError('Invalid response format: result is not an object');
      }
    } catch (error) {
      setCategoriesError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setCategoriesLoading(false);
    }
  };

  return (
    <div className="section-content">
      <CommandSection title="Get Categories">
        <button 
          onClick={handleGetCategories} 
          disabled={categoriesLoading}
          className="btn btn--primary"
        >
          {categoriesLoading ? 'Loading...' : 'Get Categories'}
        </button>
        
        {categoriesError && (
          <JsonViewer data={categoriesError} title="Error" />
        )}
        
        {categories.length > 0 && (
          <div className="data-table-wrapper">
            <h4>Categories ({categories.length})</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Parent ID</th>
                  <th>External ID</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id || category.id || index}>
                    <td>{category.name || 'Unnamed Category'}</td>
                    <td>{category.parentId || '—'}</td>
                    <td>{category.externalId || '—'}</td>
                    <td className="text-muted">{category._id || category.id || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="data-table-footer">
              <strong>Total: {categories.length} categories</strong>
            </div>
          </div>
        )}
      </CommandSection>
    </div>
  );
}

