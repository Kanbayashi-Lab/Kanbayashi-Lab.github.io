/**
 * Design note — 夜明けへ向かう支援ページ：医学的な厳密さを保ちながら、
 * 中高生と保護者が責められずに相談へ進める、静かであたたかな情報の導線をつくる。
 */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowDown, ArrowUpRight, BookOpenText, ExternalLink, Menu, MoonStar, Phone, ShieldCheck, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "はじめに", href: "#introduction" },
  { label: "症状を知る", href: "#understanding" },
  { label: "治療を考える", href: "#treatment" },
  { label: "受診・資料", href: "#care" },
  { label: "Q&A", href: "#faq" },
];

const careDocuments = [
  {
    id: "01",
    title: "まず読む：朝起きられない・夜眠れない方へ",
    description: "睡眠・覚醒障害外来が公開する患者・ご家族向けパンフレットです。",
    href: "https://www.mc-kokoro.pref.ibaraki.jp/contents/images/2021/11/suimin_DSPS.pdf",
  },
  {
    id: "02",
    title: "起立性調節障害へ睡眠医療からの支援",
    description: "治療中の方が主治医の先生と相談する際の参考資料として公開されています。",
    href: "https://www.mc-kokoro.pref.ibaraki.jp/contents/images/2025/07/report20251201.pdf",
  },
  {
    id: "03",
    title: "対応医療機関一覧（PDF）",
    description: "若者の起立性調節障害に伴う睡眠障害への対応を案内する公式一覧です。",
    href: "https://www.mc-kokoro.pref.ibaraki.jp/contents/images/2026/04/Sleep_clinic_list.pdf",
  },
];

const faqItems = [
  {
    question: "アリピプラゾールは精神科の薬と聞きました。起床困難にも使うことがあるのですか？",
    answer: "アリピプラゾールは、統合失調症や双極性障害などに用いられてきた薬です。添付資料では、睡眠相後退症候群などの概日リズム睡眠障害に対して、その作用を検討した研究・臨床経験が紹介されています。一方、睡眠相後退症候群に対する使用は本邦では適応外使用と資料に明記されています。適切かどうか、どのように使うかは、症状、体調、年齢、併存症、現在の治療を踏まえて医師が個別に判断します。自己判断での開始・中止・増減はしないでください。",
  },
  {
    question: "起立性調節障害や睡眠相後退症候群は、精神科の病気なのですか？",
    answer: "添付資料では、睡眠相後退症候群を含む睡眠・覚醒障害はICD-11で独立した章として扱われることが紹介されています。起立性調節障害には起立時の循環調節に関わる症状があり、睡眠・覚醒の問題が併存することもあります。名称だけで決めつけず、症状の背景を診察で確かめることが大切です。",
  },
  {
    question: "若いうちから薬を使っても大丈夫でしょうか？",
    answer: "薬の選択には、年齢、症状、診断、既往歴、ほかに使用している薬などを含む丁寧な確認が必要です。薬剤ごと・使用目的ごとに注意点は異なります。心配なことは診察時に遠慮なく質問し、期待できることと注意すべきことを医師・薬剤師と一緒に確認してください。",
  },
  {
    question: "薬を始めたら、一生続けることになりますか？",
    answer: "治療の期間や見直しの時期は一律ではありません。添付資料でも、発達や症状の経過にあわせて漸減中止を検討できることが示されています。薬の中止や変更が必要なときも、自己判断では行わず、処方医の指示に従ってください。",
  },
  {
    question: "薬を使うと「自分らしく」いられなくなるのではと不安です。",
    answer: "治療の目的は、睡眠・覚醒リズムや日中の生活を整えやすくすることです。一方で、治療の受け止め方や副作用の出方には個人差があります。不安や変化を感じたときは我慢せず、早めに主治医・薬剤師へ伝えてください。各薬剤の安全性情報は、必ず電子添文と医療者の説明で確認してください。",
  },
  {
    question: "朝起きられるようになれば、すぐに学校へ行けますか？",
    answer: "起床時刻が整うことは大切な一歩ですが、添付資料でも通常は再登校へのリハビリ期間が必要になる場合があると説明されています。急がず、本人・ご家族・医療機関・学校で状況を共有しながら、無理のない段階を考えていきましょう。",
  },
];

const ageSleepRows = [
  { label: "前学童期", start: "8%", width: "67%", note: "長い睡眠時間" },
  { label: "小学生", start: "17%", width: "59%", note: "就寝時刻が少し遅くなる" },
  { label: "中・高校生", start: "27%", width: "56%", note: "さらに遅寝へ" },
  { label: "大学生", start: "36%", width: "49%", note: "睡眠時間が最短に" },
  { label: "30代以降", start: "32%", width: "51%", note: "徐々に朝型へ" },
];

function ExternalArrow() {
  return <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.8} />;
}

function AgeSleepFigure() {
  return (
    <figure className="age-sleep-figure">
      <figcaption><span>FIG. 01</span><strong>睡眠時間と就床・起床時刻の加齢による変化</strong></figcaption>
      <div className="age-chart" aria-label="加齢に伴う睡眠時間と就床・起床時刻の概念図">
        <div className="age-axis"><span>19時</span><span>22時</span><span>1時</span><span>4時</span><span>7時</span><span>9時</span></div>
        {ageSleepRows.map((row) => (
          <div className="age-row" key={row.label}>
            <span className="age-label">{row.label}</span>
            <div className="age-track"><span className="age-bar" style={{ left: row.start, width: row.width }}><i /></span></div>
            <span className="age-note">{row.note}</span>
          </div>
        ))}
      </div>
      <p>前学童期から大学生にかけて、成長とともに就寝時刻は遅くなり、大学生では睡眠時間が最短になる傾向が資料で示されています。</p>
      <small>資料A 図1・資料B 図1をもとにウェブ向けに再構成</small>
    </figure>
  );
}

function DailyRhythmFigure() {
  return (
    <figure className="daily-rhythm-figure">
      <figcaption><span>FIG. 02</span><strong>日中の眠気の変化と睡眠禁止ゾーン</strong></figcaption>
      <svg className="daily-rhythm-svg" viewBox="0 0 760 255" role="img" aria-labelledby="rhythm-svg-title rhythm-svg-desc">
        <title id="rhythm-svg-title">0時就寝、7時起床の人の眠気の日内リズム</title>
        <desc id="rhythm-svg-desc">午後に眠気が強まる時間帯と、いつもの就寝時刻の2〜3時間前に覚醒度が高い睡眠禁止ゾーンを示す概念図。</desc>
        <defs><linearGradient id="rhythmFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b58a44" stopOpacity="0.26" /><stop offset="100%" stopColor="#b58a44" stopOpacity="0" /></linearGradient></defs>
        <line x1="62" y1="197" x2="716" y2="197" stroke="#8c94a0" strokeWidth="1" />
        {[62, 171, 280, 389, 498, 607, 716].map((x) => <line key={x} x1={x} y1="192" x2={x} y2="202" stroke="#8c94a0" strokeWidth="1" />)}
        <path d="M62 156 C104 184, 138 166, 171 142 C209 117, 238 125, 280 150 C315 173, 350 187, 389 183 C432 179, 461 126, 498 82 C530 43, 572 38, 607 62 C646 89, 682 146, 716 189 L716 197 L62 197 Z" fill="url(#rhythmFill)" />
        <path d="M62 156 C104 184, 138 166, 171 142 C209 117, 238 125, 280 150 C315 173, 350 187, 389 183 C432 179, 461 126, 498 82 C530 43, 572 38, 607 62 C646 89, 682 146, 716 189" fill="none" stroke="#d8bb83" strokeWidth="3" />
        <line x1="498" y1="30" x2="498" y2="197" stroke="#b58a44" strokeDasharray="4 6" /><line x1="607" y1="30" x2="607" y2="197" stroke="#b58a44" strokeDasharray="4 6" />
        <text x="520" y="23" fill="#d8bb83" fontSize="14" fontFamily="Noto Sans JP, sans-serif" fontWeight="700">睡眠禁止ゾーン</text>
        <text x="235" y="102" fill="#657080" fontSize="13" fontFamily="Noto Sans JP, sans-serif">午後の眠気が強い時間帯</text>
        <text x="62" y="225" fill="#657080" fontSize="13" fontFamily="Noto Sans JP, sans-serif">7時</text><text x="164" y="225" fill="#657080" fontSize="13" fontFamily="Noto Sans JP, sans-serif">10時</text><text x="273" y="225" fill="#657080" fontSize="13" fontFamily="Noto Sans JP, sans-serif">13時</text><text x="382" y="225" fill="#657080" fontSize="13" fontFamily="Noto Sans JP, sans-serif">16時</text><text x="491" y="225" fill="#657080" fontSize="13" fontFamily="Noto Sans JP, sans-serif">19時</text><text x="600" y="225" fill="#657080" fontSize="13" fontFamily="Noto Sans JP, sans-serif">22時</text><text x="704" y="225" fill="#657080" fontSize="13" fontFamily="Noto Sans JP, sans-serif">0時</text>
      </svg>
      <p>いつもの就寝時刻の2〜3時間前には、覚醒度が高い「睡眠禁止ゾーン」があると考えられています。「早く寝よう」としても寝つきにくい背景の一つです。</p>
      <small>資料A 図3・資料B 図2をもとにウェブ向けに再構成</small>
    </figure>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="support-site min-h-screen overflow-x-clip bg-[#f8f6ef] text-[#13213e]">
      <a href="#main-content" className="skip-link">本文へ移動</a>

      <header className={`support-header ${scrolled ? "support-header--scrolled" : ""}`}>
        <div className="header-frame">
          <a href="#top" className="support-brand" aria-label="朝の起床困難支援ページの先頭へ">
            <img src="./kanbayashi-symbol_e2b378c2.png" alt="" className="support-logo" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <span className="brand-lockup">
              <strong>朝の起床困難 支援ページ</strong>
              <small>Sleep &amp; Wake Support</small>
            </span>
          </a>
          <nav className="support-desktop-nav" aria-label="主要ナビゲーション">
            {navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          </nav>
          <button
            type="button"
            className="support-menu-button"
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="support-mobile-nav" aria-label="モバイル用ナビゲーション">
            {navLinks.map((link, index) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>{link.label}<ArrowDown aria-hidden="true" className="ml-auto h-4 w-4" />
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="main-content">
        <section id="top" className="support-hero" aria-labelledby="hero-title">
          <img src="./kanbayashi-hero_73687018.png" alt="夜明け前の空と睡眠・覚醒リズムを想起させる抽象的な軌道線" className="support-hero-image" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <div className="support-hero-overlay" aria-hidden="true" />
          <div className="support-hero-content page-frame">
            <p className="overline on-dark"><span /> FOR TEENS &amp; FAMILIES</p>
            <div className="hero-support-grid">
              <div>
                <p className="hero-quiet-label">中高生とご家族のための、睡眠・覚醒の相談案内</p>
                <h1 id="hero-title">「朝起きられない」は、<br /><em>相談できることかもしれません。</em></h1>
                <p className="hero-lead">朝の起床困難や夜の入眠困難には、睡眠・覚醒のリズムが関わることがあります。ひとりで抱え込まず、まずは症状と相談先を知るところから始めましょう。</p>
                <div className="hero-actions">
                  <a href="#introduction" className="hero-primary-action">まず知る <ArrowDown aria-hidden="true" className="h-4 w-4" /></a>
                  <a href="#care" className="hero-secondary-action">受診・資料を見る</a>
                </div>
              </div>
              <aside className="hero-side-note">
                <MoonStar aria-hidden="true" className="h-5 w-5 text-[#d8bb83]" />
                <p>夜は眠れず、朝は起きにくい。学校へ行きたいのに体がついてこない。その困りごとは、医学的な相談の対象になることがあります。</p>
                <span>情報は診断・処方の代替ではありません</span>
              </aside>
            </div>
          </div>
          <p className="hero-page-number" aria-hidden="true">01</p>
        </section>

        <section className="quick-strip" aria-label="このページで分かること">
          <div className="page-frame quick-strip-grid">
            <p>このページで分かること</p>
            <a href="#understanding"><span>01</span>症状の背景を知る <ArrowDown aria-hidden="true" className="h-4 w-4" /></a>
            <a href="#treatment"><span>02</span>治療の考え方を知る <ArrowDown aria-hidden="true" className="h-4 w-4" /></a>
            <a href="#care"><span>03</span>受診・資料を探す <ArrowDown aria-hidden="true" className="h-4 w-4" /></a>
          </div>
        </section>

        <section id="introduction" className="support-section introduction-section" aria-labelledby="introduction-title">
          <div className="page-frame story-layout">
            <aside className="chapter-marker"><p>01</p><span>INTRODUCTION</span><i /></aside>
            <div className="story-content">
              <p className="overline"><span /> はじめに</p>
              <h2 id="introduction-title" className="section-title">学校へ行きたいのに起きられない。<br />それは、怠けではないかもしれません。</h2>
              <p className="body-lead">「朝起きられない」「夜眠れない」に悩む中高生は、決して珍しくありません。朝に起きられないことは、本人にとって学校生活や将来に大きな困難につながる症状です。起立性調節障害や睡眠相後退症候群は、このような起床困難に関係する代表的な病態です。原因をひとつに決めつけず、循環器系の視点と睡眠医学の視点の両方から、その人に合う評価と支援を考えることが大切です。</p>
              <div className="reassurance-box">
                <Sparkles aria-hidden="true" className="h-5 w-5" />
                <p><strong>睡眠・覚醒障害外来では、朝の起床困難や夜の入眠困難について相談できます。</strong>資料で紹介される「若年性起床困難症」という見方は、起立性調節障害と睡眠相後退症候群の両方を視野に入れて症状を理解しようとするものです。すでに治療中の方も、症状が十分に改善しないときは、主治医に睡眠の問題について相談してみてください。</p>
              </div>
              <div className="consultation-grid" aria-label="受診前に確認したいこと">
                <p className="consultation-label">受診前に、無理のない範囲で確認してみましょう</p>
                <div><span>01</span><strong>睡眠表（睡眠日誌）</strong><small>何時に寝て、何時に起きたか。昼寝や眠気の時間も、できる範囲で記録します。</small></div>
                <div><span>02</span><strong>朝の症状</strong><small>立ちくらみ、頭痛、倦怠感、動悸など、朝に強い困りごとを言葉にしてみます。</small></div>
                <div><span>03</span><strong>日中・夕方の様子</strong><small>授業中の眠気や、夕方以降に元気が出ることなども、診察の手がかりになります。</small></div>
              </div>
            </div>
          </div>
        </section>

        <section id="understanding" className="support-section understanding-section" aria-labelledby="understanding-title">
          <div className="page-frame story-layout">
            <aside className="chapter-marker"><p>02</p><span>UNDERSTANDING</span><i /></aside>
            <div className="story-content">
              <p className="overline"><span /> 起立性調節障害と睡眠相後退症候群</p>
              <h2 id="understanding-title" className="section-title">「朝の起床困難」には、<br />異なる見方があります。</h2>
              <p className="body-lead">朝の起床困難と夜の入眠困難には、主に起立性調節障害と睡眠相後退症候群という二つの見方があります。添付資料では、前者は起立時の血圧低下や血圧維持困難を主な問題とし、後者は「社会的に望ましい時刻に入眠および覚醒することが慢性的に困難」な状態として説明されています。診断は医療機関で行われますが、違いを知ることで、相談したいことを整理しやすくなります。</p>
              <div className="condition-grid">
                <article className="condition-card condition-card--navy">
                  <p className="card-number">A</p>
                  <h3>起立性調節障害</h3>
                  <p>「たちくらみ、失神、朝起き不良、倦怠感、動悸、頭痛」などを伴うことがある、自律神経の機能不全の一つです。起立時の血圧低下・血圧維持の困難が中心となり、学童期から思春期に好発し、午前に症状が強くなることがあります。</p>
                  <a href="https://www.jisinsin.jp/general/typical_diseases/%E8%B5%B7%E7%AB%8B%E6%80%A7%E8%AA%BF%E7%AF%80%E9%9A%9C%E5%AE%B3/" target="_blank" rel="noreferrer">日本小児心身医学会の説明 <ExternalArrow /></a>
                </article>
                <article className="condition-card condition-card--paper">
                  <p className="card-number">B</p>
                  <h3>睡眠相後退症候群</h3>
                  <p>社会的に望ましい時刻に入眠・覚醒することが慢性的に困難で、多くの場合、午前3〜6時のある一定の時刻になってやっと寝つける状態を示します。思春期から青年期が好発年齢とされています。</p>
                  <a href="https://www.mc-kokoro.pref.ibaraki.jp/contents/images/2021/11/suimin_DSPS.pdf" target="_blank" rel="noreferrer">公式パンフレットを読む <ExternalArrow /></a>
                </article>
              </div>
              <div className="connection-note">
                <div><span className="connection-orbit" /><span className="connection-dot" /></div>
                <p><strong>二つは、まったく無関係ではありません。</strong>資料では、血圧の調整も睡眠・覚醒の調整も、ともに視床下部でコントロールされていることが紹介されています。起立性調節障害と睡眠相後退症候群を、若年者の起床困難を考える際の関連する視点として捉える考え方があります。症状の背景は人によって異なるため、丁寧な診察が必要です。</p>
              </div>
              <div className="relation-evidence" aria-label="資料で紹介される関連のデータ">
                <div><strong>86<small>%</small></strong><p>起立性調節障害で、朝の起床困難が認められるとする資料内の紹介</p></div>
                <div><strong>約 7<small>割</small></strong><p>20歳未満の睡眠相後退症候群で、起立性調節障害の診断基準に合致するとする資料内の紹介</p></div>
              </div>
              <p className="source-line">上記の数値は、添付資料A・Bが先行報告を紹介したものです。個々の症状や診断を示す数字ではありません。中学生の起立性調節障害は、軽症例を含め約10%と説明されています。[<a href="https://www.jisinsin.jp/general/typical_diseases/%E8%B5%B7%E7%AB%8B%E6%80%A7%E8%AA%BF%E7%AF%80%E9%9A%9C%E5%AE%B3/" target="_blank" rel="noreferrer">1</a>]</p>
            </div>
          </div>
        </section>

        <section className="rhythm-section" aria-labelledby="rhythm-title">
          <div className="page-frame rhythm-layout">
            <div className="rhythm-visual" aria-hidden="true">
              <img src="./kanbayashi-research-bridge_f2b179c1.png" alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <span className="rhythm-sun" />
              <span className="rhythm-line rhythm-line--one" />
              <span className="rhythm-line rhythm-line--two" />
            </div>
            <div className="rhythm-copy">
              <p className="overline"><span /> SLEEP RHYTHM</p>
              <h2 id="rhythm-title" className="section-title">若者の遅寝遅起きは、<br />意志だけでは説明できません。</h2>
              <p>思春期から青年期にかけて、睡眠・覚醒リズムは夜型へ傾きやすくなります。資料では、10代初めまでは朝型で、中頃から急激に夜型化が進み、30代を過ぎると徐々に朝型へ戻る変化が紹介されています。</p>
              <p>夕方から夜にかけて一時的に覚醒度が高くなる「睡眠禁止ゾーン」もあり、「明日は早いから早く寝よう」と思っても寝つきにくいことがあります。夜は元気でも朝は動けない、無理に登校しても日中に眠気が続く、といった困りごとがあるときは、生活習慣だけの問題と決めつけないことが大切です。</p>
            </div>
          </div>
          <div className="page-frame rhythm-figure-grid">
            <AgeSleepFigure />
            <DailyRhythmFigure />
          </div>
        </section>

        <section id="treatment" className="support-section treatment-section" aria-labelledby="treatment-title">
          <div className="page-frame story-layout">
            <aside className="chapter-marker"><p>03</p><span>TREATMENT</span><i /></aside>
            <div className="story-content">
              <p className="overline"><span /> 治療を考える</p>
              <h2 id="treatment-title" className="section-title">治療は、「血圧」だけでも、<br />「眠り」だけでもありません。</h2>
              <p className="body-lead">起立性調節障害と診断された場合、血圧や循環の状態に目を向けた診療が行われます。一方で、循環器系の治療だけでは改善が十分でない学童期から思春期の症例に対して、添付資料では睡眠医療の視点から診断・治療を行い、改善例を多く経験していると報告されています。睡眠相後退症候群の併存を確かめ、睡眠表（睡眠日誌）の記載、疾病教育、生活指導を行うことが、治療を考える最初の一歩です。</p>
              <div className="approach-grid">
                <article><span>01</span><h3>循環器系の評価</h3><p>立ちくらみや血圧・心拍の変化などを確認し、必要に応じて生活上の工夫や治療を考えます。</p></article>
                <article><span>02</span><h3>睡眠・覚醒の評価</h3><p>就寝・起床時刻、日中の眠気、睡眠の質などを睡眠表で確かめ、睡眠相後退症候群の併存も視野に入れます。</p></article>
                <article><span>03</span><h3>疾病教育と生活指導</h3><p>「早寝対策」「起床対策」を含め、生活リズム、学校での過ごし方、復帰までの段階を無理なく整えていきます。</p></article>
              </div>
              <div className="care-path" aria-label="資料で紹介される治療を考える流れ">
                <div><span>STEP 1</span><strong>睡眠表（睡眠日誌）を記載</strong><small>寝床に入った時刻、眠った時刻、起床時刻、日中の眠気を記録</small></div>
                <i aria-hidden="true" />
                <div><span>STEP 2</span><strong>症状と生活を評価</strong><small>起立時の症状、睡眠・覚醒リズム、学校生活を一緒に確認</small></div>
                <i aria-hidden="true" />
                <div><span>STEP 3</span><strong>専門医と治療を検討</strong><small>非薬物療法を含め、必要に応じて個別の治療選択肢を検討</small></div>
              </div>
              <div className="medicine-note">
                <div className="medicine-icon"><ShieldCheck aria-hidden="true" className="h-5 w-5" /></div>
                <div>
                  <p className="medicine-label">薬について知っておきたいこと</p>
                  <h3>「早寝対策」と「起床対策」は、医師と一緒に検討します。</h3>
                  <p>添付資料では、入眠困難に対する治療と、朝の起床困難に対する治療の両方が紹介されています。アリピプラゾールについても、睡眠相後退症候群などの概日リズム睡眠障害に対する作用が検討されています。薬が適切か、ほかの治療とどう組み合わせるかは、症状や体調、年齢、現在の治療を踏まえた個別の医療判断が必要です。</p>
                  <p className="regulatory-note"><strong>大切な注意：</strong>添付資料では、睡眠相後退症候群に対するアリピプラゾールの使用は、本邦では適応外使用と明記されています。服薬の開始・中止・量の変更を、このページの情報だけで判断しないでください。</p>
                  <a href="https://wpi-iiis.tsukuba.ac.jp/japanese/news/3714/" target="_blank" rel="noreferrer">IIISの研究成果を読む <ExternalArrow /></a>
                </div>
              </div>
              <div className="case-table-wrap">
                <div className="case-heading"><span>CASE NOTE</span><h3>睡眠表でみる、添付資料に紹介された一例</h3><p>起立性調節障害と睡眠相後退症候群を併存した15歳女性の報告です。個別の治療結果であり、同じ変化を保証するものではありません。</p></div>
                <table className="case-table"><thead><tr><th>確認したこと</th><th>治療前</th><th>資料に示された治療後の経過</th></tr></thead><tbody><tr><th>睡眠時間帯</th><td>午前3時 — 正午<br /><small>約9時間</small></td><td>午後11時 — 午前6時<br /><small>約7時間</small></td></tr><tr><th>睡眠表で見えた変化</th><td>朝の起床が困難</td><td>就寝時刻は4時間、起床時刻は6時間前進</td></tr><tr><th>診療での位置づけ</th><td colSpan={2}>睡眠日誌をもとに、睡眠・覚醒リズムと起立時の症状を評価した上で治療を検討</td></tr></tbody></table>
                <small className="case-source">資料A 図4より要約。薬剤の使用・方法・効果には個人差があり、個別の処方内容は表示していません。</small>
              </div>
            </div>
          </div>
        </section>

        <section id="care" className="care-section" aria-labelledby="care-title">
          <div className="page-frame">
            <div className="care-heading">
              <div><p className="chapter-number">04</p><p className="chapter-word">CARE &amp; RESOURCES</p></div>
              <div><p className="overline"><span /> 受診・資料</p><h2 id="care-title" className="section-title">相談先と資料を、<br />ここから確認できます。</h2></div>
            </div>
            <div className="care-primary-card">
              <div className="care-primary-intro">
                <p className="care-kicker">SLEEP &amp; WAKE CLINIC</p>
                <h3>茨城県立こころの医療センター<br />睡眠・覚醒障害外来</h3>
                <p>若年性起床困難症、概日リズム障害・覚醒障害を含む睡眠・覚醒障害に対応しています。初診は予約制です。受付条件などの最新情報は、必ず公式ページでご確認ください。</p>
              </div>
              <div className="care-contact">
                <p>初診申込み・変更・キャンセル</p>
                <a href="tel:0296771359"><Phone aria-hidden="true" className="h-5 w-5" /> 0296-77-1359</a>
                <span>平日 10:00–16:00（初診受付）</span>
                <a className="care-site-link" href="https://www.mc-kokoro.pref.ibaraki.jp/patient/outpatient/sd/" target="_blank" rel="noreferrer">外来の公式案内を見る <ExternalArrow /></a>
              </div>
            </div>
            <div className="document-list">
              {careDocuments.map((document) => (
                <a key={document.id} href={document.href} target="_blank" rel="noreferrer" className="document-item">
                  <span>{document.id}</span>
                  <div><strong>{document.title}</strong><small>{document.description}</small></div>
                  <ExternalArrow />
                </a>
              ))}
            </div>
            <p className="care-caption"><BookOpenText aria-hidden="true" className="h-4 w-4" />すでに治療を受けている方も、上の資料を参考にしながら、主治医の先生へ睡眠・覚醒の困りごとを相談できます。受診時には、可能であれば睡眠表（睡眠日誌）も持参してください。</p>
          </div>
        </section>

        <section id="faq" className="support-section faq-section" aria-labelledby="faq-title">
          <div className="page-frame faq-layout">
            <div className="faq-intro"><p className="chapter-number">05</p><p className="chapter-word">Q &amp; A</p><h2 id="faq-title" className="section-title">よくある不安に、<br />落ち着いて答えます。</h2><p>薬、受診、学校のこと。気になることを診察で聞けるように、考え方を整理します。</p></div>
            <Accordion type="single" collapsible className="faq-accordion">
              {faqItems.map((item, index) => (
                <AccordionItem key={item.question} value={`item-${index}`} className="faq-item">
                  <AccordionTrigger className="faq-trigger"><span>Q{index + 1}</span>{item.question}</AccordionTrigger>
                  <AccordionContent className="faq-answer"><p>{item.answer}</p></AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="medical-disclaimer" aria-label="医療情報に関する注意">
          <div className="page-frame disclaimer-content"><ShieldCheck aria-hidden="true" className="h-5 w-5" /><p><strong>医療情報に関する大切な注意</strong>　このページは、症状や研究・受診案内に関する一般的な情報を提供するものです。診断・治療・処方を行うものではありません。症状が続く、日常生活や通学に支障がある、薬について不安がある場合は、主治医または医療機関にご相談ください。</p></div>
        </section>

        <section className="reference-section" aria-labelledby="reference-title">
          <div className="page-frame reference-layout"><div><p className="reference-number">REF.</p><h2 id="reference-title">主な参考資料</h2></div><div className="reference-list"><p><span>[ A ]</span>神林 崇、千葉 滋、岩渕恵美、ほか．「朝の起床困難（起立性調節障害，睡眠相後退症候群）への新規の治療」日本臨牀 83巻7号，2025年．</p><p><span>[ B ]</span>神林 崇、千葉 滋、入鹿山容子、ほか．「朝に起きられない中高生『若年性起床困難症』への対処法：起立性調節障害と睡眠相後退症候群の異同について」不眠研究，2022年．</p><p><span>[ 1 ]</span><a href="https://www.jisinsin.jp/general/typical_diseases/%E8%B5%B7%E7%AB%8B%E6%80%A7%E8%AA%BF%E7%AF%80%E9%9A%9C%E5%AE%B3/" target="_blank" rel="noreferrer">一般社団法人 日本小児心身医学会「起立性調節障害」</a></p></div></div>
        </section>
      </main>

      <footer className="support-footer">
        <div className="page-frame footer-grid">
          <div className="footer-identity"><img src="./kanbayashi-symbol_e2b378c2.png" alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} /><span>朝の起床困難 支援ページ</span></div>
          <p>研究紹介：神林 崇<br />筑波大学 国際統合睡眠医科学研究機構</p>
          <div className="footer-links"><a href="https://wpi-iiis.tsukuba.ac.jp/japanese/research/member/detail/takashikanbayashi/" target="_blank" rel="noreferrer">神林崇 公式プロフィール <ExternalLink aria-hidden="true" className="h-3 w-3" /></a><a href="https://wpi-iiis.tsukuba.ac.jp/" target="_blank" rel="noreferrer">WPI-IIIS <ExternalLink aria-hidden="true" className="h-3 w-3" /></a></div>
        </div>
      </footer>
    </div>
  );
}
