import { useState } from "react";
import { FileText, Sparkles, Copy, Download, ChevronDown, ChevronUp, Check, Loader2, Eye, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ExplainerSection {
  id: string;
  heading: string;
  body: string;
  bullets: string[];
}

interface ExplainerResult {
  title: string;
  subtitle: string;
  audience: string;
  use_case: string;
  sections: ExplainerSection[];
  callout_box: {
    title: string;
    body: string;
    bullets: string[];
  };
  cta: {
    heading: string;
    body: string;
    button_text: string;
    suggested_link_anchor: string;
  };
  visual_layout: {
    hero_block: string;
    section_order: string[];
    design_notes: string;
  };
  brand_tokens_used: {
    primary_color: string | null;
    secondary_color: string | null;
    accent_color: string | null;
    font_style: string | null;
    tone_notes: string;
  };
}

const USE_CASES = [
  { value: "internal-strategy", label: "Internal strategy one-pager" },
  { value: "investor", label: "Investor / fundraising one-pager" },
  { value: "clinical-overview", label: "Clinical program overview" },
  { value: "product-explainer", label: "Product / feature explainer" },
  { value: "patient-friendly", label: "Patient-friendly explainer" },
  { value: "custom", label: "Custom (other)" },
];

const BRAND_STYLES = [
  { value: "techy-surgeon", label: "Techy Surgeon – editorial, clinical, modern", colors: { primary: "#0B2545", secondary: "#3B82F6", accent: "#F59E0B" } },
  { value: "revelai", label: "RevelAi – gradient, health tech SaaS", colors: { primary: "#6366F1", secondary: "#8B5CF6", accent: "#EC4899" } },
  { value: "minimal-saas", label: "Minimal SaaS – neutral, clean, deck-friendly", colors: { primary: "#1F2937", secondary: "#6B7280", accent: "#10B981" } },
  { value: "custom", label: "Custom" },
];

const TONES = [
  { value: "executive", label: "Concise & executive" },
  { value: "clinical", label: "Clinical / academic" },
  { value: "accessible", label: "Warm & accessible" },
  { value: "marketing", label: "Marketing-forward" },
];

export function OnePageExplainerBuilder() {
  // Form state
  const [sourceContent, setSourceContent] = useState("");
  const [references, setReferences] = useState("");
  const [audience, setAudience] = useState("");
  const [useCase, setUseCase] = useState("");
  const [desiredAction, setDesiredAction] = useState("");
  const [brandStyle, setBrandStyle] = useState("");
  const [customBrandTokens, setCustomBrandTokens] = useState("");
  const [tone, setTone] = useState("");
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ExplainerResult | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    source: true,
    audience: false,
    brand: false,
  });
  const [viewMode, setViewMode] = useState<"preview" | "json">("preview");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleGenerate = async () => {
    if (!sourceContent.trim()) {
      toast.error("Please provide source content to generate the explainer");
      return;
    }

    if (!audience.trim()) {
      toast.error("Please specify your target audience");
      return;
    }

    setIsGenerating(true);

    try {
      const selectedBrand = BRAND_STYLES.find(b => b.value === brandStyle);
      const brandTokens = brandStyle === "custom" 
        ? customBrandTokens 
        : selectedBrand?.colors 
          ? `Primary: ${selectedBrand.colors.primary}, Secondary: ${selectedBrand.colors.secondary}, Accent: ${selectedBrand.colors.accent}` 
          : "";

      const { data, error } = await supabase.functions.invoke("generate-explainer", {
        body: {
          sourceContent,
          references,
          audience,
          useCase: USE_CASES.find(u => u.value === useCase)?.label || useCase,
          desiredAction,
          brandStyle: BRAND_STYLES.find(b => b.value === brandStyle)?.label || brandStyle,
          brandTokens,
          tone: TONES.find(t => t.value === tone)?.label || tone,
        },
      });

      if (error) throw error;

      setResult(data.explainer);
      toast.success("1-Page Explainer generated!");
    } catch (error) {
      console.error("Error generating explainer:", error);
      toast.error("Failed to generate explainer. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadAsMarkdown = () => {
    if (!result) return;

    let markdown = `# ${result.title}\n\n`;
    markdown += `*${result.subtitle}*\n\n`;
    markdown += `**Audience:** ${result.audience}\n\n`;
    markdown += `---\n\n`;

    result.sections.forEach(section => {
      markdown += `## ${section.heading}\n\n`;
      markdown += `${section.body}\n\n`;
      if (section.bullets.length > 0) {
        section.bullets.forEach(bullet => {
          markdown += `- ${bullet}\n`;
        });
        markdown += `\n`;
      }
    });

    if (result.callout_box.title) {
      markdown += `> ### ${result.callout_box.title}\n`;
      markdown += `> ${result.callout_box.body}\n`;
      result.callout_box.bullets.forEach(bullet => {
        markdown += `> - ${bullet}\n`;
      });
      markdown += `\n`;
    }

    markdown += `---\n\n`;
    markdown += `## ${result.cta.heading}\n\n`;
    markdown += `${result.cta.body}\n\n`;
    markdown += `**[${result.cta.button_text}](${result.cta.suggested_link_anchor})**\n`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title.toLowerCase().replace(/\s+/g, "-")}-explainer.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded as Markdown");
  };

  const downloadAsHTML = () => {
    if (!result) return;

    const selectedBrand = BRAND_STYLES.find(b => b.value === brandStyle);
    const colors = selectedBrand?.colors || { primary: "#1a365d", secondary: "#3B82F6", accent: "#F59E0B" };

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${result.title}</title>
    <style>
        :root {
            --primary: ${colors.primary};
            --secondary: ${colors.secondary};
            --accent: ${colors.accent};
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 11pt; line-height: 1.5; color: #1f2937; background: #fff; }
        .page { max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
        .header { background: var(--primary); color: white; padding: 1.5rem 2rem; margin: -0.5in -0.5in 1.5rem; }
        .header h1 { font-size: 1.75rem; margin-bottom: 0.25rem; }
        .header .tagline { color: rgba(255,255,255,0.85); font-size: 0.95rem; }
        .section { margin-bottom: 1.25rem; }
        .section h2 { font-size: 1rem; font-weight: 600; color: var(--primary); border-bottom: 2px solid var(--accent); padding-bottom: 0.25rem; margin-bottom: 0.5rem; }
        .section p { margin-bottom: 0.5rem; }
        .section ul { margin-left: 1.25rem; }
        .section li { margin-bottom: 0.25rem; }
        .callout { background: #f8fafc; border-left: 4px solid var(--accent); padding: 1rem; margin: 1rem 0; }
        .callout h3 { font-size: 0.95rem; color: var(--primary); margin-bottom: 0.5rem; }
        .cta { background: #f1f5f9; border-top: 3px solid var(--primary); padding: 1rem 1.5rem; margin-top: 1.5rem; }
        .cta h3 { color: var(--primary); margin-bottom: 0.25rem; }
        .cta-button { display: inline-block; background: var(--accent); color: white; padding: 0.5rem 1.5rem; border-radius: 4px; text-decoration: none; font-weight: 600; margin-top: 0.5rem; }
        @media print { .page { max-width: none; padding: 0; } }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <h1>${result.title}</h1>
            <p class="tagline">${result.subtitle}</p>
        </div>
        
        ${result.sections.map(section => `
        <div class="section">
            <h2>${section.heading}</h2>
            <p>${section.body}</p>
            ${section.bullets.length > 0 ? `<ul>${section.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        </div>
        `).join('')}
        
        ${result.callout_box.title ? `
        <div class="callout">
            <h3>${result.callout_box.title}</h3>
            <p>${result.callout_box.body}</p>
            ${result.callout_box.bullets.length > 0 ? `<ul>${result.callout_box.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        </div>
        ` : ''}
        
        <div class="cta">
            <h3>${result.cta.heading}</h3>
            <p>${result.cta.body}</p>
            <a href="${result.cta.suggested_link_anchor}" class="cta-button">${result.cta.button_text}</a>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title.toLowerCase().replace(/\s+/g, "-")}-explainer.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded as HTML");
  };

  const getPlainText = () => {
    if (!result) return "";
    
    let text = `${result.title}\n${result.subtitle}\n\n`;
    text += `Audience: ${result.audience}\n\n`;
    
    result.sections.forEach(section => {
      text += `${section.heading}\n`;
      text += `${section.body}\n`;
      section.bullets.forEach(bullet => {
        text += `• ${bullet}\n`;
      });
      text += `\n`;
    });

    if (result.callout_box.title) {
      text += `[${result.callout_box.title}]\n`;
      text += `${result.callout_box.body}\n`;
      result.callout_box.bullets.forEach(bullet => {
        text += `• ${bullet}\n`;
      });
      text += `\n`;
    }

    text += `${result.cta.heading}\n`;
    text += `${result.cta.body}\n`;
    text += `→ ${result.cta.button_text}`;
    
    return text;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">1-Page Explainer</h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Give us the long version—Techy Memo turns it into a sharp, branded one-pager your audience can actually read.
        </p>
        <p className="text-xs text-muted-foreground">
          Perfect for investor one-pagers, internal strategy explainers, clinical program overviews, or patient-friendly summaries.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-4">
          {/* Step 1: Source Material */}
          <Collapsible open={expandedSections.source} onOpenChange={() => toggleSection("source")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
                      Source Material
                    </span>
                    {expandedSections.source ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    <Label htmlFor="source">Paste your document, notes, or transcript</Label>
                    <Textarea
                      id="source"
                      placeholder="Paste up to ~10,000 characters. This can be a paper, meeting notes, voice memo transcript, or rough draft."
                      value={sourceContent}
                      onChange={(e) => setSourceContent(e.target.value)}
                      className="min-h-[200px] resize-y"
                    />
                    <p className="text-xs text-muted-foreground">{sourceContent.length.toLocaleString()} characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="references">Key links or references (optional)</Label>
                    <Textarea
                      id="references"
                      placeholder="Add links, citations, or references you want preserved."
                      value={references}
                      onChange={(e) => setReferences(e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Step 2: Audience & Purpose */}
          <Collapsible open={expandedSections.audience} onOpenChange={() => toggleSection("audience")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
                      Audience & Purpose
                    </span>
                    {expandedSections.audience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    <Label htmlFor="audience">Primary audience</Label>
                    <Input
                      id="audience"
                      placeholder="e.g., hospital CFO, seed investor, orthopedic surgeons, parents of toddlers"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="useCase">Use case</Label>
                    <Select value={useCase} onValueChange={setUseCase}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select use case" />
                      </SelectTrigger>
                      <SelectContent>
                        {USE_CASES.map((uc) => (
                          <SelectItem key={uc.value} value={uc.value}>
                            {uc.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="action">What do you want them to do after reading?</Label>
                    <Input
                      id="action"
                      placeholder="Schedule a call, approve pilot, sign LOI, share with team, etc."
                      value={desiredAction}
                      onChange={(e) => setDesiredAction(e.target.value)}
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Step 3: Brand & Tone */}
          <Collapsible open={expandedSections.brand} onOpenChange={() => toggleSection("brand")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">3</span>
                      Brand & Tone
                    </span>
                    {expandedSections.brand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    <Label>Brand style</Label>
                    <Select value={brandStyle} onValueChange={setBrandStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand style" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRAND_STYLES.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {brandStyle === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="customBrand">Brand tokens</Label>
                      <Textarea
                        id="customBrand"
                        placeholder="Primary color: #0B2545 Secondary: #3B82F6 Accent: #F59E0B Font vibe: clinical editorial / SF Pro"
                        value={customBrandTokens}
                        onChange={(e) => setCustomBrandTokens(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TONES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !sourceContent.trim() || !audience.trim()}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate 1-Page Explainer
              </>
            )}
          </Button>
        </div>

        {/* Preview/Results */}
        <div className="space-y-4">
          <Card className="min-h-[500px]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generated Explainer
                </CardTitle>
                {result && (
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "preview" | "json")}>
                    <TabsList className="h-8">
                      <TabsTrigger value="preview" className="text-xs px-2">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="json" className="text-xs px-2">
                        <Code className="w-3 h-3 mr-1" />
                        JSON
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">Your generated explainer will appear here</p>
                  <p className="text-xs mt-1">Fill in the form and click Generate</p>
                </div>
              ) : viewMode === "preview" ? (
                <div className="space-y-4 text-sm">
                  {/* Title Block */}
                  <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                    <h3 className="text-lg font-bold text-foreground">{result.title}</h3>
                    <p className="text-muted-foreground mt-1">{result.subtitle}</p>
                    <p className="text-xs text-muted-foreground mt-2">Audience: {result.audience}</p>
                  </div>

                  {/* Sections */}
                  {result.sections.map((section) => (
                    <div key={section.id} className="space-y-1">
                      <h4 className="font-semibold text-foreground border-b border-border pb-1">{section.heading}</h4>
                      <p className="text-muted-foreground">{section.body}</p>
                      {section.bullets.length > 0 && (
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground ml-2">
                          {section.bullets.map((bullet, i) => (
                            <li key={i}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  {/* Callout */}
                  {result.callout_box.title && (
                    <div className="bg-accent/10 border-l-4 border-accent p-3 rounded-r-lg">
                      <h5 className="font-semibold text-foreground">{result.callout_box.title}</h5>
                      <p className="text-muted-foreground text-xs mt-1">{result.callout_box.body}</p>
                      {result.callout_box.bullets.length > 0 && (
                        <ul className="list-disc list-inside text-xs text-muted-foreground mt-1">
                          {result.callout_box.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="bg-muted/50 p-4 rounded-lg border-t-2 border-primary">
                    <h5 className="font-semibold text-foreground">{result.cta.heading}</h5>
                    <p className="text-muted-foreground text-sm mt-1">{result.cta.body}</p>
                    <div className="mt-2">
                      <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-medium">
                        {result.cta.button_text}
                      </span>
                    </div>
                  </div>

                  {/* Design Notes */}
                  {result.visual_layout.design_notes && (
                    <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                      <strong>Layout hints:</strong> {result.visual_layout.design_notes}
                    </div>
                  )}
                </div>
              ) : (
                <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-auto max-h-[450px]">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* Export Actions */}
          {result && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(getPlainText(), "text")}
                className="flex-1 min-w-0"
              >
                {copiedField === "text" ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                Copy Text
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "json")}
                className="flex-1 min-w-0"
              >
                {copiedField === "json" ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                Copy JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsMarkdown}
                className="flex-1 min-w-0"
              >
                <Download className="w-3 h-3 mr-1" />
                Markdown
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsHTML}
                className="flex-1 min-w-0"
              >
                <Download className="w-3 h-3 mr-1" />
                HTML
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
