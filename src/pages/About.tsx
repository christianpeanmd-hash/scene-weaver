import { Link } from "react-router-dom";
import { TechyMemoLogo } from "@/components/MemoableLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Sparkles, Users, Lightbulb, User, Library, Film } from "lucide-react";
import techySurgeonLogo from "@/assets/techy-surgeon-logo.png";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="About"
        description="TechyMemo helps you turn raw ideas into visual artifacts you can actually use. Built for creators, founders, clinicians, and knowledge workers who think in big ideas but need clean outputs."
      />

      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <TechyMemoLogo size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/videos"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              <Film className="w-4 h-4" />
              <span className="hidden sm:inline">Videos</span>
            </Link>
            <Link
              to="/library"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            About TechyMemo
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We built TechyMemo for people who think in big, messy ideas—but still need clean, visual outputs they can ship fast.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-16">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Turn raw ideas into visual artifacts you can actually use
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed pl-0 md:pl-13">
              <p>
                TechyMemo is a small, opinionated tool for turning long, unstructured thinking—voice notes, scripts, decks, research docs—into production-ready storyboards, images, infographics, and 1-pagers.
              </p>
              <p>
                Under the hood, it's "prompt-first": we obsess over structure and reusable templates so you don't have to write the perfect Sora, Veo, Runway, or Midjourney prompt from scratch every time. On the surface, it feels like a visual builder you can use between meetings.
              </p>
              <p className="font-medium text-foreground">
                You paste once. TechyMemo handles the structure, scenes, and prompts—so you can stay focused on the story.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Built for people who ship ideas, not just files
              </h2>
            </div>
            <ul className="space-y-4 pl-0 md:pl-13">
              <li className="flex gap-3">
                <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Creators & educators</strong> who want short explainers, lesson visuals, and social clips without living inside a timeline.
                </span>
              </li>
              <li className="flex gap-3">
                <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Founders & operators</strong> who spend their lives in docs and decks and just want a clean visual to send to the team or investors.
                </span>
              </li>
              <li className="flex gap-3">
                <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Clinicians, researchers, and knowledge workers</strong> who need figures, visual abstracts, and 1-page summaries instead of walls of text.
                </span>
              </li>
            </ul>
            <p className="text-muted-foreground italic pl-0 md:pl-13 pt-2">
              If you've ever thought "I know what I want, I just don't have time to build it"—you're the person we're building for.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Our approach: templates, not one-off prompts
              </h2>
            </div>
            <div className="space-y-4 pl-0 md:pl-13">
              <p className="text-muted-foreground">
                Most AI tools give you a blank box and ask you to type magic words.
              </p>
              <p className="text-muted-foreground">
                TechyMemo starts from the opposite direction:
              </p>
              <div className="bg-muted/50 rounded-xl p-6 space-y-3">
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">1</span>
                  <span className="text-foreground"><strong>You bring the idea.</strong> A script, a transcript, a messy memo, or a rough outline.</span>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">2</span>
                  <span className="text-foreground"><strong>We apply structure.</strong> We break it into scenes, panels, slides, or sections depending on the template.</span>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">3</span>
                  <span className="text-foreground"><strong>We generate visuals and prompts.</strong> You can render media right inside TechyMemo, or copy the optimized prompts into your favorite AI tools.</span>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">4</span>
                  <span className="text-foreground"><strong>You reuse it.</strong> Once you like a look or a format, you can run new ideas through the same template again and again.</span>
                </div>
              </div>
              <p className="text-muted-foreground">
                The goal isn't just "one cool output." It's building a small library of patterns you can lean on whenever you need to explain something.
              </p>
            </div>
          </section>

          {/* Mid-page CTA */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-500/20 p-8 text-center">
            <div className="relative z-10">
              <Button asChild size="lg" className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-lg">
                <Link to="/auth">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start creating with TechyMemo
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Explore the tool, then pick a plan that fits
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Built by someone who lives in docs, decks, and operating rooms
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground pl-0 md:pl-13">
              <p>
                TechyMemo started as a personal workflow hack. I'm a practicing orthopedic surgeon and health-tech founder who spends a lot of time bouncing between clinical work, research, and building companies.
              </p>
              <p>I wanted a way to:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  Take a long Note, Substack draft, or meeting transcript
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  Turn it into a storyboard or 1-pager
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  And be one paste away from Sora/Veo/Runway-ready prompts
                </li>
              </ul>
              <p>
                None of the meeting tools or generic "prompt libraries" quite scratched that itch, so TechyMemo became the little workbench I kept coming back to. Now I'm opening it up for other people who think in the same chaotic but structured way.
              </p>
            </div>
          </section>

          {/* Section 5 - Newsletter */}
          <section className="bg-card border border-border rounded-2xl p-8 md:p-10">
            <div className="flex flex-col items-center text-center">
              <img 
                src={techySurgeonLogo} 
                alt="Techy Surgeon" 
                className="h-20 md:h-24 w-auto mb-6"
              />
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                Stay in the loop: the Techy Surgeon newsletter
              </h2>
              <p className="text-muted-foreground max-w-xl mb-6">
                If you like the idea behind TechyMemo, you'll probably enjoy the Techy Surgeon newsletter too. It's where I share:
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">
                  AI workflows for medicine & startups
                </span>
                <span className="px-3 py-1.5 text-sm rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Behind-the-scenes experiments
                </span>
                <span className="px-3 py-1.5 text-sm rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Visual storytelling tricks
                </span>
              </div>
              
              {/* Substack Embed */}
              <div className="flex justify-center w-full mb-6">
                <iframe 
                  src="https://techysurgeon.substack.com/embed" 
                  width="100%" 
                  height="150" 
                  style={{ 
                    maxWidth: '400px',
                    border: 'none',
                    borderRadius: '12px',
                    background: 'transparent'
                  }}
                  frameBorder="0" 
                  scrolling="no"
                  title="Subscribe to Techy Surgeon Newsletter"
                />
              </div>

              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Questions, ideas, or collabs?{" "}
                <a href="mailto:hello@techysurgeon.com" className="text-primary hover:underline">
                  hello@techysurgeon.com
                </a>
              </p>
            </div>
          </section>

          {/* Section 6 - CTA */}
          <section className="text-center py-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Let's see what your ideas look like
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              You don't need a full project to try TechyMemo. Grab a paragraph from your notes, a meeting summary, or a rough script and see what comes out the other side.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600">
              <Link to="/">
                <Sparkles className="w-4 h-4 mr-2" />
                Turn a memo into a visual
              </Link>
            </Button>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
