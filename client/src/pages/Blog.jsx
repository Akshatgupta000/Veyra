export default function Blog() {
  return (
    <>
      <section className="hero" style={{ backgroundColor: '#fce4e4', padding: '60px 0', textAlign: 'center', marginBottom: '60px' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: 20, color: '#222' }}>Fashion & Lifestyle Blog</h1>
          <p style={{ maxWidth: 700, margin: '0 auto', color: '#555', fontSize: '1.1rem' }}>
            Discover the latest trends, style tips, and fashion inspiration. From runway to everyday wear, we&apos;ve got you covered with expert advice and curated collections.
          </p>
        </div>
      </section>
      <section className="container features" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 30, marginBottom: 60 }}>
        <div className="feature" style={{ textAlign: 'center', padding: '30px 20px', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div className="feature-icon" style={{ fontSize: '2rem', marginBottom: 20 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <h3 style={{ marginBottom: 15, fontSize: '1.3rem' }}>Weekly Updates</h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Get fresh content every week with our latest fashion trends, style guides, and lifestyle tips.</p>
        </div>
        <div className="feature" style={{ textAlign: 'center', padding: '30px 20px', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div className="feature-icon" style={{ fontSize: '2rem', marginBottom: 20 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h3 style={{ marginBottom: 15, fontSize: '1.3rem' }}>Expert Contributors</h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Our articles are written by fashion industry professionals with years of experience.</p>
        </div>
        <div className="feature" style={{ textAlign: 'center', padding: '30px 20px', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div className="feature-icon" style={{ fontSize: '2rem', marginBottom: 20 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <h3 style={{ marginBottom: 15, fontSize: '1.3rem' }}>Community Discussions</h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Join our community of fashion enthusiasts to share ideas and get inspired.</p>
        </div>
        <div className="feature" style={{ textAlign: 'center', padding: '30px 20px', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div className="feature-icon" style={{ fontSize: '2rem', marginBottom: 20 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
          </div>
          <h3 style={{ marginBottom: 15, fontSize: '1.3rem' }}>Trend Analytics</h3>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Stay ahead with our data-driven insights on upcoming fashion and lifestyle trends.</p>
        </div>
      </section>
      <section className="container blog-section" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', marginBottom: 80 }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 40, fontSize: '2rem' }}>Latest Articles</h2>
        <div className="blog-posts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 40 }}>
          <div className="blog-post" style={{ background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div className="blog-image" style={{ height: 250, overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1557776639-0208033c9112?q=80&w=3087&auto=format&fit=crop" alt="Fashion Week Highlights" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: 25 }}>
              <div style={{ display: 'flex', gap: 15, color: '#888', fontSize: '0.85rem', marginBottom: 10 }}><span>April 10, 2025</span><span>Fashion</span></div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: 12, lineHeight: 1.4 }}>Spring 2025 Fashion Week Highlights: Colors and Patterns</h3>
              <p style={{ color: '#666', marginBottom: 20, fontSize: '0.95rem' }}>Explore the standout trends from this season&apos;s runway shows, with a focus on bold color palettes and innovative pattern combinations.</p>
              <a href="#" className="read-more" style={{ padding: '8px 0', color: '#333', fontWeight: 500 }}>Read More</a>
            </div>
          </div>
          <div className="blog-post" style={{ background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div className="blog-image" style={{ height: 250, overflow: 'hidden' }}>
              <img src="https://plus.unsplash.com/premium_photo-1713586580802-854a58542159?q=80&w=3087&auto=format&fit=crop" alt="Sustainable Fashion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: 25 }}>
              <div style={{ display: 'flex', gap: 15, color: '#888', fontSize: '0.85rem', marginBottom: 10 }}><span>April 8, 2025</span><span>Sustainability</span></div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: 12, lineHeight: 1.4 }}>The Rise of Eco-Conscious Fashion Brands in 2025</h3>
              <p style={{ color: '#666', marginBottom: 20, fontSize: '0.95rem' }}>Discover the innovative brands leading the charge in sustainable fashion with ethical practices and eco-friendly materials.</p>
              <a href="#" className="read-more" style={{ padding: '8px 0', color: '#333', fontWeight: 500 }}>Read More</a>
            </div>
          </div>
          <div className="blog-post" style={{ background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div className="blog-image" style={{ height: 250, overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=3087&auto=format&fit=crop" alt="Accessory Trends" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: 25 }}>
              <div style={{ display: 'flex', gap: 15, color: '#888', fontSize: '0.85rem', marginBottom: 10 }}><span>April 5, 2025</span><span>Accessories</span></div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: 12, lineHeight: 1.4 }}>Statement Accessories That Will Transform Your Wardrobe</h3>
              <p style={{ color: '#666', marginBottom: 20, fontSize: '0.95rem' }}>Learn how the right accessories can elevate even the simplest outfit, from bold jewelry to designer bags.</p>
              <a href="#" className="read-more" style={{ padding: '8px 0', color: '#333', fontWeight: 500 }}>Read More</a>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-gradient-to-r from-gray-200 to-pink-900 py-16 mb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Our Newsletter</h3>
            <p className="text-gray-700 mb-8">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent" />
              <button type="submit" className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors shadow-md font-medium">Subscribe Now</button>
            </form>
            <p className="text-xs text-gray-600 mt-4">By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.</p>
          </div>
        </div>
      </div>
      <section className="container categories" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', marginBottom: 80 }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 40, fontSize: '2rem' }}>Explore Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 30 }}>
          {['Women\'s Fashion', 'Men\'s Style', 'Beauty & Makeup', 'Sustainable Fashion'].map((title, i) => (
            <div key={title} style={{ position: 'relative', height: 200, borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <img src={['https://images.unsplash.com/photo-1584998316204-3b1e3b1895ae?q=80&w=3087', 'https://images.unsplash.com/photo-1635944201335-f9165880a0b6?q=80&w=3164', 'https://images.unsplash.com/photo-1723150512429-bfa92988d845?q=80&w=2944', 'https://images.unsplash.com/photo-1631050165089-6311e0d6c5f3?q=80&w=2888'][i]} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', padding: 20 }}>
                <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 500 }}>{title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
