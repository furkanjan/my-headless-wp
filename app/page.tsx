async function getWordPressPosts() {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!apiUrl) return [];

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetPosts {
            posts {
              nodes {
                id
                title
                slug
                excerpt
              }
            }
          }
        `,
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const { data } = await res.json();
    return data?.posts?.nodes || [];
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const posts = await getWordPressPosts();

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '28px', color: '#111', marginBottom: '24px' }}>
        Yeni Hızlı Sitem (Headless WordPress)
      </h1>

      {posts.length === 0 ? (
        <p style={{ color: '#666' }}>Henüz gösterilecek yazı bulunamadı veya bağlantı bekleniyor.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {posts.map((post: any) => (
            <article 
              key={post.id} 
              style={{ 
                border: '1px solid #e2e8f0', 
                padding: '20px', 
                borderRadius: '12px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h2 
                style={{ fontSize: '20px', color: '#2563eb', marginBottom: '8px' }}
                dangerouslySetInnerHTML={{ __html: post.title }} 
              />
              <div 
                style={{ color: '#4b5563', lineHeight: '1.6' }}
                dangerouslySetInnerHTML={{ __html: post.excerpt }} 
              />
            </article>
          ))}
        </div>
      )}
    </main>
  );
}