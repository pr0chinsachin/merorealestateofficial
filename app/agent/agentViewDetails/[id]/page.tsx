"use client";

import { useEffect, useState } from "react";
import { EnvelopeIcon, PhoneIcon, ShareIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import fallback from "../../../../public/noavatar.png";
import BASE_URL from "../../../urlConfig/urlConfig";
import SERVER_URL from "../../../urlConfig/serverUrl";
import styles from "./profile.module.css";

interface AgentData {
  agentName: string;
  designation?: string | null;
  address?: string | null;
  experience?: string | null;
  skill?: string | null;
  email?: string | null;
  contact?: string | null;
  description?: string | null;
  fbLink?: string | null;
  websiteLink?: string | null;
  linkedInLink?: string | null;
  agentImgPath?: string | null;
  createdDate?: string | null;
  status: boolean;
  deleted: boolean;
}

type ProfileState = { status: "loading" | "unavailable" | "error" } |
  { status: "ready"; agent: AgentData };

const dateFormat = new Intl.DateTimeFormat("en-AU", {
  day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
});

function webLink(value?: string | null) {
  const url = value?.trim();
  if (!url) return null;

  try {
    const parsed = new URL(/^[a-z][a-z\d+.-]*:/i.test(url) ? url : `https://${url}`);
    return ["http:", "https:"].includes(parsed.protocol) && parsed.hostname.includes(".")
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}

export default function AgentViewDetails({ params }: { params: { id: string } }) {
  return <Profile key={params.id} id={params.id} />;
}

function Profile({ id }: { id: string }) {
  const [state, setState] = useState<ProfileState>({ status: "loading" });
  const [imageFailed, setImageFailed] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const query = new URLSearchParams({ id });
        const response = await fetch(`${BASE_URL}/Agent/UpdateAgents?${query}`, {
          signal: controller.signal,
        });
        if (response.status === 404) {
          setState({ status: "unavailable" });
          return;
        }
        if (!response.ok) throw new Error("Unable to load agent");
        const agent: AgentData | null = await response.json();
        setState(agent?.agentName?.trim() && agent.status && !agent.deleted
          ? { status: "ready", agent }
          : { status: "unavailable" });
      } catch {
        if (!controller.signal.aborted) setState({ status: "error" });
      }
    }

    loadProfile();
    return () => controller.abort();
  }, [id]);

  const agent = state.status === "ready" ? state.agent : null;

  async function shareProfile() {
    setShareStatus("");
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${agent?.agentName} | Mero Real Estate`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareStatus("Profile link copied.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setShareStatus("Copy the profile link from your address bar.");
    }
  }

  const phone = agent?.contact?.trim();
  const phoneHref = phone?.replace(/[^\d+]/g, "");
  const email = agent?.email?.trim();
  const skills = Array.from(new Set(agent?.skill?.split(/[,;\n]+/).map((skill) => skill.trim()).filter(Boolean)));
  const created = agent?.createdDate ? new Date(agent.createdDate) : null;
  const profileDate = created && Number.isFinite(created.getTime()) ? dateFormat.format(created) : null;
  const links = [
    { label: "Website", href: webLink(agent?.websiteLink) },
    { label: "Facebook", href: webLink(agent?.fbLink) },
    { label: "LinkedIn", href: webLink(agent?.linkedInLink) },
  ].filter((link): link is { label: string; href: string } => link.href !== null);
  const portrait = agent?.agentImgPath?.trim().replace(/^~/, "");

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/agent">Agents</Link></li>
            <li aria-current="page">{agent?.agentName || "Agent profile"}</li>
          </ol>
        </nav>

        {agent ? (
          <>
            <div className={styles.hero}>
              <Image
                src={portrait && !imageFailed ? `${SERVER_URL}${portrait}` : fallback}
                alt=""
                width={148}
                height={148}
                priority
                unoptimized={Boolean(portrait && !imageFailed)}
                onError={() => setImageFailed(true)}
                className={styles.portrait}
              />
              <div className={styles.identity}>
                <p className={styles.label}>Agent profile</p>
                <h1>{agent.agentName}</h1>
                {agent.designation?.trim() && <p className={styles.role}>{agent.designation}</p>}
                {(agent.experience?.trim() || profileDate) && (
                  <ul className={styles.metadata}>
                    {agent.experience?.trim() && <li>Experience: {agent.experience}</li>}
                    {profileDate && <li>Profile added {profileDate}</li>}
                  </ul>
                )}
                <div className={styles.actions}>
                  {phone && phoneHref && (showPhone ? (
                    <a className={styles.primary} href={`tel:${phoneHref}`}><PhoneIcon aria-hidden="true" />{phone}</a>
                  ) : (
                    <button className={styles.primary} type="button" onClick={() => setShowPhone(true)}><PhoneIcon aria-hidden="true" />Show number</button>
                  ))}
                  {email && <a href={`mailto:${email}`}><EnvelopeIcon aria-hidden="true" />Email agent</a>}
                  <button type="button" onClick={shareProfile}><ShareIcon aria-hidden="true" />Share profile</button>
                </div>
                {shareStatus && <p className={styles.feedback} role="status">{shareStatus}</p>}
              </div>
            </div>

            {agent.description?.trim() && (
              <section className={styles.section}>
                <h2 className={styles.label}>About</h2>
                <p className={styles.description}>{agent.description}</p>
              </section>
            )}

            {(skills.length > 0 || agent.address?.trim() || email || links.length > 0) && (
              <div className={`${styles.section} ${styles.details}`}>
                {skills.length > 0 && (
                  <section>
                    <h2 className={styles.label}>Skills</h2>
                    <ul className={styles.skills}>{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                  </section>
                )}
                {(agent.address?.trim() || email || links.length > 0) && (
                  <section>
                    <h2 className={styles.label}>Contact and links</h2>
                    {agent.address?.trim() && <p className={styles.address}>{agent.address}</p>}
                    {email && <p className={styles.email}><a href={`mailto:${email}`}>{email}</a></p>}
                    {links.length > 0 && (
                      <ul className={styles.links}>
                        {links.map(({ label, href }) => <li key={label}><a href={href} target="_blank" rel="noopener noreferrer">{label}</a></li>)}
                      </ul>
                    )}
                  </section>
                )}
              </div>
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <h1>Agent profile</h1>
            <p role="status">
              {state.status === "loading" ? "Loading agent profile…" :
                state.status === "unavailable" ? "This agent profile is unavailable." :
                  "Couldn’t load the agent profile. Please try again later."}
            </p>
            {state.status !== "loading" && <Link href="/agent">Back to agents</Link>}
          </div>
        )}
      </div>
    </div>
  );
}
