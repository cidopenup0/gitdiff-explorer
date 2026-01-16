"use client";

import React, { useMemo } from 'react';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/github.css';

export default function CodeBlock({ content, language }) {
  const highlighted = useMemo(() => {
    if (!content) return '';
    try {
      const res = language ? hljs.highlight(content, { language }) : hljs.highlightAuto(content);
      return res.value;
    } catch (err) {
      return hljs.highlightAuto(content).value;
    }
  }, [content, language]);

  return (
    <pre className="code-block" dangerouslySetInnerHTML={{ __html: highlighted }} />
  );
}
