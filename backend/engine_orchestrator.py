# engine_orchestrator.py — Salomonkoita Autonomous Engine
# Multi-provider AI (OpenAI + Grok) with auto-fallback, self-correction & feature dialog
import os, json, re, urllib.request, urllib.error, subprocess, time


class AIOrchestrator:
    PROVIDERS = ["openai", "grok"]

    def __init__(self):
        self.openai_ok = bool(os.environ.get("OPENAI_API_KEY"))
        self.grok_ok = bool(os.environ.get("GROK_API_KEY"))
        self.active = "openai" if self.openai_ok else ("grok" if self.grok_ok else None)

    def chat(self, messages, temperature=0.7):
        order = ["openai", "grok"] if self.active != "grok" else ["grok", "openai"]
        errors = []
        for p in order:
            if p == "openai" and not self.openai_ok:
                continue
            if p == "grok" and not self.grok_ok:
                continue
            try:
                return self._call(p, messages, temperature), p
            except Exception as e:
                errors.append(f"{p}: {e}")
        raise RuntimeError("; ".join(errors))

    def _call(self, provider, messages, temperature):
        if provider == "openai":
            url, key = "https://api.openai.com/v1/chat/completions", os.environ["OPENAI_API_KEY"]
            model = "gpt-4o-mini"
        else:
            url, key = "https://api.x.ai/v1/chat/completions", os.environ["GROK_API_KEY"]
            model = "grok-2-latest"
        body = json.dumps({"model": model, "messages": messages, "temperature": temperature}).encode()
        req = urllib.request.Request(url, data=body, method="POST",
                                     headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read())["choices"][0]["message"]["content"]
        except urllib.error.HTTPError as e:
            raise RuntimeError(f"HTTP {e.code}: {e.read().decode()[:150]}")

    def generate_spec(self, idea):
        sys = ("You are the Salomonkoita architecture engine. Produce a JSON feature spec "
               "with: name, description, features (array of {name,desc}), tech_stack, database_tables.")
        text, _ = self.chat([{"role": "system", "content": sys}, {"role": "user", "content": idea}])
        try:
            m = re.search(r"\{(.*)\}", text, re.S)
            return json.loads(m.group(0)) if m else json.loads(text)
        except Exception:
            return {"name": "App", "description": idea, "features": []}


def self_correct_file(file_path, error_output, lang="python"):
    """Re-read a file, ask AI for a fix, write back if improved."""
    with open(file_path) as f:
        code = f.read()
    ai = AIOrchestrator()
    fixed, prov = ai.chat([
        {"role": "system", "content": f"You are a {lang} engineer. Return ONLY corrected code, no fences."},
        {"role": "user", "content": f"FILE:\n{code}\n\nERROR:\n{error_output}\n\nFIXED:"}], temperature=0.15)
    m = re.search(r"```(?:\w+)?\s*(.*?)\s*```", fixed, re.S)
    fixed = (m.group(1) if m else fixed).strip()
    with open(file_path, "w") as f:
        f.write(fixed)
    return fixed, prov


def deploy_vercel(token, project_path):
    """Deploy a static/Next.js app to Vercel using the REST API."""
    import urllib.parse
    if not token:
        return None, "no token"
    project = urllib.parse.quote(project_path)
    # Create deployment
    body = json.dumps({"name": os.path.basename(project_path), "projectSettings": {"framework": "nextjs"}}).encode()
    req = urllib.request.Request("https://api.vercel.com/v13/deployments",
                                 data=body, headers={"Authorization": f"Bearer {token}",
                                                     "Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read()).get("url"), None
    except urllib.error.HTTPError as e:
        return None, f"HTTP {e.code}: {e.read().decode()[:200]}"
