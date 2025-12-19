export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Anime Brat Generator</h1>

      <form action="/api/generate">
        <input
          name="text"
          placeholder="Teks"
          style={{ padding: 10, fontSize: 18 }}
        />
        <button style={{ padding: 10, marginLeft: 10 }}>
          Generate
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        API:
        <br />
        <code>/api/generate?text=HALO&size=80</code>
      </p>
    </main>
  );
}