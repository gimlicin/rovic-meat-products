import { Head } from '@inertiajs/react';

export default function ProductsMinimal(props: any) {
  console.log('ProductsMinimal props:', props);
  
  return (
    <>
      <Head title="Products - Test" />
      
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Minimal Products Page</h1>
        <p>If you see this, React is rendering.</p>
        
        <h2>Props received:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(props, null, 2)}
        </pre>
      </div>
    </>
  );
}
