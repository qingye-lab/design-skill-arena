"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Bookmark,
  Check,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import {
  MODEL_NAME,
  MODEL_SLUG,
  showcaseDefinitions,
  type ShowcaseId,
} from "./campaign-data";
import styles from "./campaign-studio.module.css";

export type Variant = "A" | "B" | "C";
type Phase = "ready" | "loading" | "success" | "error";

type Campaign = {
  title: string;
  channel: string;
  when: string;
  brief: string;
  audience: string;
  tone: string;
  visualStyle: string;
  variant: Variant;
};

const storageKey = "muse-gpt-6-luna-campaigns";
const minimumBriefLength = 24;

const campaignVariants: Record<
  Variant,
  { title: string; description: string; reach: number; ctr: number; conversion: number }
> = {
  A: {
    title: "Sound, wherever life lands.",
    description: "One speaker. A thousand new listening rituals.",
    reach: 124000,
    ctr: 3.4,
    conversion: 1.8,
  },
  B: {
    title: "Make room for sound.",
    description: "A little more music in the middle of everything.",
    reach: 108000,
    ctr: 4.2,
    conversion: 2.2,
  },
  C: {
    title: "Stay for one more song.",
    description: "The late hour has never sounded so good.",
    reach: 89000,
    ctr: 4.8,
    conversion: 2.6,
  },
};

const initialRecent: Campaign[] = [
  {
    title: "Morrow Arc · Coastline",
    channel: "Social",
    when: "Today",
    brief: "Launch Morrow Arc, a portable speaker for design-minded travelers. Make listening feel at home wherever the day goes.",
    audience: "Design-minded travelers",
    tone: "Quiet confidence",
    visualStyle: "Coastal editorial",
    variant: "A",
  },
  {
    title: "A room of its own",
    channel: "Launch site",
    when: "Yesterday",
    brief: "Introduce Morrow Arc to music-led homes. Focus on intimate gatherings, considered materials, and easy everyday listening.",
    audience: "Music-led households",
    tone: "Warm and assured",
    visualStyle: "Studio minimal",
    variant: "B",
  },
  {
    title: "After the last train",
    channel: "Email",
    when: "Sep 18",
    brief: "Give city commuters a more personal soundtrack for the hour between work and home.",
    audience: "City commuters",
    tone: "Playful",
    visualStyle: "Night cinema",
    variant: "C",
  },
];

const audienceOptions = [
  "Design-minded travelers",
  "Music-led households",
  "City commuters",
  "Early adopters",
];
const channelOptions = ["Social", "Launch site", "Email", "Retail" ];
const toneOptions = ["Quiet confidence", "Warm and assured", "Playful", "Refined"];
const visualOptions = [
  "Coastal editorial",
  "Studio minimal",
  "Night cinema",
  "Botanical still life",
];

const channelLift: Record<string, number> = {
  Social: 1.1,
  "Launch site": 0.6,
  Email: 0.2,
  Retail: -0.1,
};
const audienceLift: Record<string, number> = {
  "Design-minded travelers": 1.2,
  "Music-led households": 0.8,
  "City commuters": 0.4,
  "Early adopters": 1.5,
};

export type CampaignState = ReturnType<typeof useCampaign>;

export function useCampaign() {
  const [brief, setBriefValue] = useState(
    "Launch Morrow Arc, a portable speaker for people who take the long way home. Lead with freedom, tactile design, and the small rituals that make a place yours.",
  );
  const [audience, setAudience] = useState(audienceOptions[0]);
  const [channel, setChannel] = useState(channelOptions[0]);
  const [tone, setTone] = useState(toneOptions[0]);
  const [visualStyle, setVisualStyle] = useState(visualOptions[0]);
  const [variant, setVariant] = useState<Variant>("A");
  const [phase, setPhase] = useState<Phase>("ready");
  const [notice, setNotice] = useState("Ready when you are.");
  const [revision, setRevision] = useState(1);
  const [recent, setRecent] = useState<Campaign[]>(initialRecent);
  const [recentLoading, setRecentLoading] = useState(true);
  const generateTimer = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const campaigns = parsed.filter(isCampaign).slice(0, 4);
            if (campaigns.length) setRecent(campaigns);
          }
        }
      } catch {
        // A private browsing session may disable storage; demo campaigns remain available.
      } finally {
        setRecentLoading(false);
      }
    }, 220);

    return () => {
      window.clearTimeout(timer);
      if (generateTimer.current) window.clearTimeout(generateTimer.current);
    };
  }, []);

  const showError = useCallback((message: string) => {
    setPhase("error");
    setNotice(message);
  }, []);

  const setBrief = useCallback((value: string) => {
    setBriefValue(value);
    setPhase((current) => (current === "error" ? "ready" : current));
    setNotice((current) =>
      current.includes("Add more detail") ? "Ready when you are." : current,
    );
  }, []);

  const canGenerate = brief.trim().length >= minimumBriefLength;

  useEffect(() => {
    if (phase === "error" && !canGenerate) {
      document.getElementById("campaign-brief")?.focus();
    }
  }, [canGenerate, phase]);

  const generate = useCallback(() => {
    if (generateTimer.current) window.clearTimeout(generateTimer.current);
    if (brief.trim().length < minimumBriefLength) {
      showError(`Add more detail to the brief (at least ${minimumBriefLength} characters).`);
      return;
    }

    setPhase("loading");
    setNotice("Building three directions for your brief…");
    generateTimer.current = window.setTimeout(() => {
      setRevision((value) => value + 1);
      setVariant("A");
      setPhase("success");
      setNotice("Three directions are ready. Choose A, B, or C to compare.");
    }, 680);
  }, [brief, showError]);

  const writeRecent = useCallback(
    (nextRecent: Campaign[]) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(nextRecent));
        setRecent(nextRecent);
        setPhase("success");
        setNotice("Campaign saved on this device.");
      } catch {
        showError("This browser blocked local storage. Your current brief is still here.");
      }
    },
    [showError],
  );

  const save = useCallback(() => {
    if (brief.trim().length < minimumBriefLength) {
      showError(`Add more detail to the brief before saving it.`);
      return;
    }

    const nextCampaign: Campaign = {
      title: `Morrow Arc · ${campaignVariants[variant].title.replace(/\.$/, "")}`,
      channel,
      when: "Just now",
      brief,
      audience,
      tone,
      visualStyle,
      variant,
    };
    writeRecent([nextCampaign, ...recent].slice(0, 4));
  }, [audience, brief, channel, recent, showError, tone, variant, visualStyle, writeRecent]);

  const exportCampaign = useCallback(() => {
    if (brief.trim().length < minimumBriefLength) {
      showError("Add a little more detail before exporting this campaign.");
      return;
    }

    try {
      const payload = {
        product: "Morrow Arc",
        model: { name: MODEL_NAME, id: MODEL_SLUG },
        skillCombination: showcaseDefinitions[document.body.dataset.showcase as ShowcaseId]?.skills,
        createdAt: new Date().toISOString(),
        brief,
        audience,
        channel,
        tone,
        visualStyle,
        selectedDirection: variant,
        simulatedForecast: forecastFor({ audience, channel, revision, variant }),
      };
      const file = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const href = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = href;
      link.download = "morrow-arc-campaign.json";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
      setPhase("success");
      setNotice("Campaign export is ready.");
    } catch {
      showError("The campaign could not be exported. Please try again.");
    }
  }, [audience, brief, channel, revision, showError, tone, variant, visualStyle]);

  const restore = useCallback((campaign: Campaign) => {
    setBriefValue(campaign.brief);
    setAudience(campaign.audience);
    setChannel(campaign.channel);
    setTone(campaign.tone);
    setVisualStyle(campaign.visualStyle);
    setVariant(campaign.variant);
    setPhase("success");
    setNotice(`Loaded “${campaign.title}”.`);
  }, []);

  return {
    brief,
    audience,
    channel,
    tone,
    visualStyle,
    variant,
    phase,
    notice,
    revision,
    recent,
    recentLoading,
    canGenerate,
    setBrief,
    setAudience,
    setChannel,
    setTone,
    setVisualStyle,
    setVariant,
    generate,
    save,
    exportCampaign,
    restore,
  };
}

function isCampaign(value: unknown): value is Campaign {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<Campaign>;
  return (
    typeof item.title === "string" &&
    typeof item.channel === "string" &&
    typeof item.when === "string" &&
    typeof item.brief === "string" &&
    typeof item.audience === "string" &&
    typeof item.tone === "string" &&
    typeof item.visualStyle === "string" &&
    (item.variant === "A" || item.variant === "B" || item.variant === "C")
  );
}

function forecastFor({
  audience,
  channel,
  revision,
  variant,
}: {
  audience: string;
  channel: string;
  revision: number;
  variant: Variant;
}) {
  const source = campaignVariants[variant];
  const lift = (channelLift[channel] ?? 0) + (audienceLift[audience] ?? 0);
  return {
    reach: Math.round(source.reach * (1 + (lift - 0.7 + Math.min(revision - 1, 5) * 0.025) / 10)),
    ctr: Math.max(0.1, source.ctr + lift * 0.16 + Math.min(revision - 1, 5) * 0.08),
    conversion: Math.max(
      0.1,
      source.conversion + (audienceLift[audience] ?? 0) * 0.09 + Math.min(revision - 1, 5) * 0.04,
    ),
  };
}

export function StudioShell({
  id,
  state,
  children,
}: {
  id: ShowcaseId;
  state: CampaignState;
  children: ReactNode;
}) {
  const definition = showcaseDefinitions[id];

  useEffect(() => {
    document.body.dataset.showcase = id;
    return () => {
      delete document.body.dataset.showcase;
    };
  }, [id]);

  return (
    <main className={styles.page} data-design={id} data-phase={state.phase}>
      <header className={styles.identityBar}>
        <a className={styles.museMark} href="#campaign-studio" aria-label="Muse Campaign Studio home">
          MUSE<span>®</span>
        </a>
        <div className={styles.identityProduct}>
          <span>Campaign studio</span>
          <strong>Morrow Arc</strong>
        </div>
        <div className={styles.modelIdentity}>
          <strong>{MODEL_NAME}</strong>
          <span>Model ID · {MODEL_SLUG}</span>
        </div>
        <div className={styles.skillIdentity}>
          <span>Skill combination</span>
          <strong>{definition.skills}</strong>
        </div>
      </header>
      <div className={styles.liveNotice} role={state.phase === "error" ? "alert" : "status"} aria-live="polite">
        {state.phase === "loading" ? <LoaderCircle aria-hidden="true" size={16} /> : null}
        {state.phase === "success" ? <Check aria-hidden="true" size={16} /> : null}
        {state.phase === "error" ? <span aria-hidden="true">!</span> : null}
        <span>{state.notice}</span>
      </div>
      <div id="campaign-studio" className={styles.workspace}>
        {children}
      </div>
    </main>
  );
}

export function PageTitle({ children, detail }: { children: ReactNode; detail?: string }) {
  return (
    <div className={styles.pageTitle}>
      <h1>{children}</h1>
      {detail ? <p>{detail}</p> : null}
    </div>
  );
}

export function BriefField({ state }: { state: CampaignState }) {
  const invalid = state.phase === "error" && !state.canGenerate;
  return (
    <div className={styles.briefField}>
      <label htmlFor="campaign-brief">Brief</label>
      <textarea
        id="campaign-brief"
        value={state.brief}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => state.setBrief(event.target.value)}
        rows={4}
        maxLength={600}
        required
        aria-invalid={invalid}
        aria-describedby="campaign-brief-help"
      />
      <div id="campaign-brief-help" className={styles.fieldHelper}>
        {invalid ? (
          <span className={styles.fieldError}>Use at least {minimumBriefLength} characters.</span>
        ) : (
          <span>Describe the launch, its audience, and the feeling to leave behind.</span>
        )}
        <span>{state.brief.trim().length} / 600</span>
      </div>
    </div>
  );
}

export function CampaignControls({ state, compact = false }: { state: CampaignState; compact?: boolean }) {
  return (
    <div className={`${styles.controls} ${compact ? styles.controlsCompact : ""}`}>
      <SelectField label="Audience" value={state.audience} values={audienceOptions} onChange={state.setAudience} />
      <SelectField label="Channel" value={state.channel} values={channelOptions} onChange={state.setChannel} />
      <SelectField label="Tone" value={state.tone} values={toneOptions} onChange={state.setTone} />
      <SelectField label="Visual style" value={state.visualStyle} values={visualOptions} onChange={state.setVisualStyle} />
    </div>
  );
}

function SelectField({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  const id = `campaign-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <div className={styles.selectField}>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {values.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function VariantPicker({ state, className = "" }: { state: CampaignState; className?: string }) {
  return (
    <div className={`${styles.variantPicker} ${className}`} role="tablist" aria-label="Campaign directions">
      {(["A", "B", "C"] as const).map((key) => (
        <button
          className={styles.variantButton}
          type="button"
          role="tab"
          id={`direction-tab-${key}`}
          aria-selected={state.variant === key}
          aria-controls="campaign-preview"
          onClick={() => state.setVariant(key)}
          onKeyDown={(event) => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
            event.preventDefault();
            const order: Variant[] = ["A", "B", "C"];
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const next = order[(order.indexOf(key) + direction + order.length) % order.length];
            state.setVariant(next);
            document.getElementById(`direction-tab-${next}`)?.focus();
          }}
          key={key}
        >
          <span>{key}</span>
          <small>{key === "A" ? "Coastline" : key === "B" ? "Everyday" : "After dark"}</small>
        </button>
      ))}
    </div>
  );
}

export function CampaignPreview({ state, className = "" }: { state: CampaignState; className?: string }) {
  const content = campaignVariants[state.variant];
  return (
    <article
      className={`${styles.campaignPreview} ${className}`}
      id="campaign-preview"
      role="tabpanel"
      aria-labelledby={`direction-tab-${state.variant}`}
      data-variant={state.variant}
      data-visual={state.visualStyle.toLowerCase().replaceAll(" ", "-")}
    >
      <div className={styles.campaignImage} role="img" aria-label="Morrow Arc portable speaker at a coastal overlook">
        <div className={styles.campaignCopy}>
          <span className={styles.campaignBrand}>MORROW / ARC</span>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
          <span className={styles.campaignCta}>Discover Arc <ArrowUpRight aria-hidden="true" size={14} /></span>
        </div>
        <span className={styles.campaignEdition}>DIRECTION {state.variant} · 0{state.revision}</span>
      </div>
      <div className={styles.previewCaption}>
        <span>{state.channel} launch creative</span>
        <span>{state.visualStyle}</span>
      </div>
    </article>
  );
}

export function Forecast({ state, inline = false }: { state: CampaignState; inline?: boolean }) {
  const values = forecastFor(state);
  return (
    <section className={`${styles.forecast} ${inline ? styles.forecastInline : ""}`} aria-label="Simulated campaign forecast">
      <div className={styles.forecastHeading}>
        <h2>Forecast</h2>
        <span>Simulated</span>
      </div>
      <dl>
        <div><dt>Reach</dt><dd>{new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(values.reach)}</dd></div>
        <div><dt>CTR</dt><dd>{values.ctr.toFixed(1)}%</dd></div>
        <div><dt>Conversion</dt><dd>{values.conversion.toFixed(1)}%</dd></div>
      </dl>
    </section>
  );
}

export function CampaignActions({ state, className = "" }: { state: CampaignState; className?: string }) {
  const busy = state.phase === "loading";
  return (
    <div className={`${styles.actions} ${className}`}>
      <button className={styles.generateButton} type="button" onClick={state.generate} disabled={busy} aria-busy={busy}>
        {busy ? <LoaderCircle aria-hidden="true" size={16} className={styles.spinner} /> : <Sparkles aria-hidden="true" size={16} />}
        <span>{busy ? "Generating…" : "Generate"}</span>
      </button>
      <button className={styles.secondaryButton} type="button" onClick={state.save}>
        <Bookmark aria-hidden="true" size={15} /> <span>Save</span>
      </button>
      <button className={styles.secondaryButton} type="button" onClick={state.exportCampaign}>
        <ArrowDownToLine aria-hidden="true" size={15} /> <span>Export</span>
      </button>
    </div>
  );
}

export function RecentCampaigns({ state, className = "" }: { state: CampaignState; className?: string }) {
  return (
    <section className={`${styles.recentCampaigns} ${className}`} aria-label="Recent campaigns" aria-busy={state.recentLoading}>
      <div className={styles.recentHeading}>
        <h2>Recent campaigns</h2>
        <span>{state.recentLoading ? "Loading" : `${state.recent.length} saved`}</span>
      </div>
      {state.recentLoading ? (
        <div className={styles.recentSkeleton} aria-label="Loading recent campaigns">
          <i /><i /><i />
        </div>
      ) : (
        <ul>
          {state.recent.map((campaign) => (
            <li key={`${campaign.title}-${campaign.when}`}>
              <button type="button" onClick={() => state.restore(campaign)}>
                <span className={styles.recentThumb} aria-hidden="true" />
                <span className={styles.recentText}>
                  <strong>{campaign.title}</strong>
                  <small>{campaign.channel} <span aria-hidden="true">·</span> {campaign.when}</small>
                </span>
                <ArrowUpRight aria-hidden="true" size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Panel({ title, children, className = "", detail }: { title?: string; children: ReactNode; className?: string; detail?: string }) {
  return (
    <section className={`${styles.panel} ${className}`}>
      {title ? <div className={styles.panelHeading}><h2>{title}</h2>{detail ? <span>{detail}</span> : null}</div> : null}
      {children}
    </section>
  );
}

export function SkillStamp({ children }: { children: ReactNode }) {
  return <span className={styles.skillStamp}>{children}</span>;
}
