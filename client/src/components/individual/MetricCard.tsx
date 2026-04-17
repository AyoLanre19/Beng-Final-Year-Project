import React from "react";

export default function MetricCard({
  title,
  large,
  subtitle,
  children,
}: {
  title: string;
  large?: boolean;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`metric-card ${large ? "metric-card-large" : ""}`}>
      <div className="metric-title">{title}</div>
      <div className="metric-value">{children}</div>
      {subtitle && <div className="metric-sub">{subtitle}</div>}
    </div>
  );
}