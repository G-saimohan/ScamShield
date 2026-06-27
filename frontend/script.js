let trendChart;
let categoryChart;
let activeContentType = "message";
let isAuthenticated = false;

const qs = (selector) => document.querySelector(selector);
const routes = ["overview", "analyzer", "website", "media", "community", "education", "admin"];
let mediaMetadata = {};

function riskClass(risk) {
    return String(risk || "Low").replace(/\s+/g, "");
}

async function postJSON(url, payload) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Request failed");
    }
    return data;
}

async function checkAuth() {
    try {
        const response = await fetch("/api/auth-status");
        const data = await response.json();
        isAuthenticated = Boolean(data.authenticated);
        updateAuthView();
        return isAuthenticated;
    } catch (error) {
        isAuthenticated = false;
        updateAuthView();
        return false;
    }
}

function updateAuthView() {
    document.body.classList.toggle("auth-active", !isAuthenticated);
    qs("#appWrapper").style.display = isAuthenticated ? "flex" : "none";
    qs("#authShell").style.display = isAuthenticated ? "none" : "grid";
}

async function submitLogin(event) {
    event.preventDefault();
    const button = qs("#loginForm button");
    const email = qs("#loginEmail").value;
    const password = qs("#loginPassword").value;

    button.textContent = "Signing in...";
    button.disabled = true;

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Login failed");
        }
        isAuthenticated = true;
        updateAuthView();
        await loadDashboard();
        showPage("overview");
    } catch (error) {
        alert(error.message);
    } finally {
        button.textContent = "Sign in";
        button.disabled = false;
    }
}

async function logout() {
    try {
        await fetch("/api/logout", { method: "POST" });
    } catch (error) {
        console.warn(error);
    }
    isAuthenticated = false;
    updateAuthView();
}

async function loadDashboard() {
    if (!isAuthenticated) return;
    const response = await fetch("/api/dashboard");
    const data = await response.json();

    qs("#metricScans").textContent = data.metrics.scans_today.toLocaleString();
    qs("#metricCritical").textContent = data.metrics.critical_threats;
    qs("#metricReports").textContent = data.metrics.community_reports;
    qs("#metricUsers").textContent = data.metrics.protected_users.toLocaleString();

    qs("#threatFeed").innerHTML = data.threat_feed
        .map((item) => `<div>> ${item}</div>`)
        .join("");

    renderTrendChart(data.trend_series);
    renderCategoryChart(data.category_series);
    renderHeatmap(data.heatmap);
    renderReports(data.reports);
    renderHistory(data.history);
}

function renderTrendChart(series) {
    const ctx = qs("#trendChart");
    if (trendChart) trendChart.destroy();

    trendChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 AM", "2 AM", "4 AM"],
            datasets: [{
                label: "Threat reports",
                data: series,
                borderColor: "#27e0a3",
                backgroundColor: "rgba(39, 224, 163, 0.12)",
                fill: true,
                tension: 0.38,
                pointRadius: 4,
                pointBackgroundColor: "#47a3ff",
            }],
        },
        options: chartOptions(),
    });
}

function renderCategoryChart(categories) {
    const ctx = qs("#categoryChart");
    if (categoryChart) categoryChart.destroy();

    categoryChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ["#27e0a3", "#47a3ff", "#ff5166", "#f4b740", "#9b7cff"],
                borderWidth: 0,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { color: "#b8c7d6", boxWidth: 12 },
                },
            },
        },
    });
}

function chartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { color: "rgba(148, 163, 184, 0.12)" },
                ticks: { color: "#8fa3b7" },
            },
            y: {
                grid: { color: "rgba(148, 163, 184, 0.12)" },
                ticks: { color: "#8fa3b7" },
            },
        },
        plugins: {
            legend: { display: false },
        },
    };
}

function renderHeatmap(points) {
    qs("#heatmap").innerHTML = points.map((point) => `
        <div class="heat-dot" style="left:${point.x}%; top:${point.y}%">
            <span>${point.city} - ${point.reports}</span>
        </div>
    `).join("");
}

function renderReports(reports) {
    qs("#reportsTable").innerHTML = reports.map((report) => `
        <div class="report-row">
            <div>
                <strong>${report.title}</strong>
                <div class="muted">${report.type} / ${report.location} / ${report.status}</div>
            </div>
            <span class="risk ${riskClass(report.risk)}">${report.risk}</span>
            <span class="muted">#${report.id}</span>
        </div>
    `).join("");
}

function renderHistory(history) {
    const empty = `<p class="muted">Your scan history will appear here after analysis.</p>`;
    qs("#historyList").innerHTML = history.length ? history.map((item) => `
        <div class="history-row">
            <div>
                <strong>${item.kind}</strong>
                <div class="muted">${item.input}</div>
            </div>
            <span class="risk ${riskClass(item.risk)}">${item.score}</span>
        </div>
    `).join("") : empty;
}

function renderAnalysis(data) {
    qs("#analysisRisk").textContent = `${data.risk_level} risk`;
    qs("#analysisScore").textContent = `${data.scam_probability}%`;
    qs("#analysisSummary").textContent = data.processing_note
        ? `${data.summary} ${data.processing_note}`
        : data.summary;
    qs("#recommendedAction").textContent = data.recommended_action;

    qs("#indicatorList").innerHTML = data.indicators.map((indicator) => `
        <div class="indicator">
            <strong>${indicator.name}</strong>
            <span class="muted">${indicator.detail}</span>
        </div>
    `).join("");
}

function renderUrl(data) {
    qs("#urlResult").textContent = `${data.result} / ${data.risk_level} risk`;
    qs("#trustScore").textContent = `${data.trust_score}%`;
    qs("#meterFill").style.width = `${data.trust_score}%`;
    qs("#urlExplanation").textContent = data.explanation;
    qs("#urlIndicators").innerHTML = data.danger_indicators.map((item) => `
        <div class="indicator">
            <strong>${item}</strong>
            <span class="muted">${data.recommended_action}</span>
        </div>
    `).join("");
}

function renderMediaResult(data) {
    qs("#mediaRisk").textContent = data.simple_result || data.risk_level;
    qs("#mediaScore").textContent = `${data.ai_likelihood}%`;
    qs("#authenticityScore").textContent = `${data.ai_likelihood}%`;
    qs("#mediaMeterFill").style.width = `${data.ai_likelihood}%`;
    qs("#mediaExplanation").textContent = `${data.risk_level}. ${data.explanation}`;
    qs("#mediaAction").textContent = data.recommended_action;

    const metricCards = data.forensic_metrics && Object.keys(data.forensic_metrics).length
        ? Object.entries(data.forensic_metrics).map(([key, value]) => `
            <div class="indicator metric-card">
                <strong>${simpleMetricName(key)}</strong>
                <span class="muted">${value}</span>
            </div>
        `).join("")
        : "";

    qs("#mediaIndicators").innerHTML = `
        ${metricCards}
        ${data.indicators.map((indicator) => `
        <div class="indicator">
            <strong>${indicator.name}</strong>
            <span class="muted">${indicator.detail}</span>
        </div>
        `).join("")}
    `;
}

function simpleMetricName(key) {
    const names = {
        width: "Width",
        height: "Height",
        entropy: "Detail level",
        edge_mean: "Edge sharpness",
        noise_level: "Camera grain",
        color_cluster_variance: "Color pattern",
        has_exif: "Camera details",
    };
    return names[key] || key.replaceAll("_", " ");
}

async function analyzeContent() {
    const button = qs("#analyzeBtn");
    button.textContent = "Analyzing...";
    button.disabled = true;

    try {
        const uploadInput = activeContentType === "screenshot"
            ? qs("#screenshotInput")
            : activeContentType === "voice"
                ? qs("#audioInput")
                : null;

        let data;
        if (uploadInput?.files?.length) {
            const formData = new FormData();
            formData.append("file", uploadInput.files[0]);
            formData.append("content_type", activeContentType);
            formData.append("transcript", qs("#contentInput").value);

            const response = await fetch("/api/analyze-file", {
                method: "POST",
                body: formData,
            });
            data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "File analysis failed");
            }
        } else {
            data = await postJSON("/api/analyze", {
                content_type: activeContentType,
                content: qs("#contentInput").value,
            });
        }
        renderAnalysis(data);
        await loadDashboard();
    } catch (error) {
        alert(error.message);
    } finally {
        button.textContent = "Run AI Analysis";
        button.disabled = false;
    }
}

async function checkUrl() {
    const button = qs("#urlBtn");
    button.textContent = "Checking...";
    button.disabled = true;

    try {
        const data = await postJSON("/api/check-url", { url: qs("#urlInput").value });
        renderUrl(data);
        await loadDashboard();
    } catch (error) {
        alert(error.message);
    } finally {
        button.textContent = "Check URL";
        button.disabled = false;
    }
}

async function submitReport() {
    const button = qs("#reportBtn");
    button.textContent = "Submitting...";
    button.disabled = true;

    try {
        await postJSON("/api/report", {
            title: qs("#reportTitle").value,
            type: qs("#reportType").value,
            location: qs("#reportLocation").value,
            description: qs("#reportDescription").value,
        });

        qs("#reportTitle").value = "";
        qs("#reportLocation").value = "";
        qs("#reportDescription").value = "";
        await loadDashboard();
    } catch (error) {
        alert(error.message);
    } finally {
        button.textContent = "Submit Report";
        button.disabled = false;
    }
}

async function analyzeMedia() {
    const input = qs("#mediaInput");
    const button = qs("#mediaBtn");

    if (!input.files.length) {
        alert("Please upload an image or video first.");
        return;
    }

    button.textContent = "Analyzing...";
    button.disabled = true;

    try {
        const formData = new FormData();
        formData.append("file", input.files[0]);
        if (mediaMetadata.width) formData.append("width", mediaMetadata.width);
        if (mediaMetadata.height) formData.append("height", mediaMetadata.height);
        if (mediaMetadata.duration) formData.append("duration", mediaMetadata.duration);

        const response = await fetch("/api/analyze-media", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Media analysis failed");
        }

        renderMediaResult(data);
        await loadDashboard();
    } catch (error) {
        alert(error.message);
    } finally {
        button.textContent = "Analyze Media";
        button.disabled = false;
    }
}

function wireTabs() {
    document.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
            tab.classList.add("active");
            activeContentType = tab.dataset.type;
            updateUploadPanels();
        });
    });
}

function showPage(route) {
    const page = routes.includes(route) ? route : "overview";

    document.querySelectorAll(".app-page").forEach((section) => {
        section.classList.toggle("active", section.id === page);
    });

    document.querySelectorAll(".nav a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${page}`);
    });

    if (window.location.hash !== `#${page}`) {
        history.replaceState(null, "", `#${page}`);
    }

    window.scrollTo({ top: 0, behavior: "auto" });
}

function wireRouting() {
    document.querySelectorAll(".nav a, [data-route]").forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = link.dataset.route || link.getAttribute("href")?.replace("#", "");
            if (!target) return;
            event.preventDefault();
            showPage(target);
            qs("#sidebar").classList.remove("is-open");
        });
    });

    window.addEventListener("hashchange", () => {
        showPage(window.location.hash.replace("#", ""));
    });
}

function wireMobileNav() {
    qs("#mobileNavToggle").addEventListener("click", () => {
        qs("#sidebar").classList.toggle("is-open");
    });
}

function updateUploadPanels() {
    qs("#screenshotUploadPanel").classList.toggle("hidden", activeContentType !== "screenshot");
    qs("#audioUploadPanel").classList.toggle("hidden", activeContentType !== "voice");

    if (activeContentType === "screenshot") {
        qs("#contentInput").placeholder = "Paste text extracted from the screenshot, or describe what is visible...";
    } else if (activeContentType === "voice") {
        qs("#contentInput").placeholder = "Paste the call transcript or important lines from the audio...";
    } else {
        qs("#contentInput").placeholder = "Paste a suspicious SMS, email, WhatsApp message, OCR text, or call transcript...";
    }
}

function wireFilePreviews() {
    qs("#screenshotInput").addEventListener("change", (event) => {
        const file = event.target.files[0];
        const preview = qs("#screenshotPreview");
        if (!file) {
            preview.classList.add("hidden");
            preview.innerHTML = "";
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        preview.innerHTML = `
            <strong>${file.name}</strong>
            <p class="muted">${Math.round(file.size / 1024)} KB image ready for analysis.</p>
            <img src="${imageUrl}" alt="Uploaded scam screenshot preview">
        `;
        preview.classList.remove("hidden");
    });

    qs("#audioInput").addEventListener("change", (event) => {
        const file = event.target.files[0];
        const preview = qs("#audioPreview");
        if (!file) {
            preview.classList.add("hidden");
            preview.innerHTML = "";
            return;
        }

        const audioUrl = URL.createObjectURL(file);
        preview.innerHTML = `
            <strong>${file.name}</strong>
            <p class="muted">${Math.round(file.size / 1024)} KB audio file ready for transcript analysis.</p>
            <audio controls src="${audioUrl}"></audio>
        `;
        preview.classList.remove("hidden");
    });

    qs("#mediaInput").addEventListener("change", (event) => {
        const file = event.target.files[0];
        const preview = qs("#mediaPreview");
        mediaMetadata = {};

        if (!file) {
            preview.classList.add("hidden");
            preview.innerHTML = "";
            return;
        }

        const mediaUrl = URL.createObjectURL(file);
        const isVideo = file.type.startsWith("video/");

        preview.innerHTML = `
            <strong>${file.name}</strong>
            <p class="muted">${Math.round(file.size / 1024)} KB ${isVideo ? "video" : "image"} selected.</p>
            ${isVideo
                ? `<video controls src="${mediaUrl}"></video>`
                : `<img src="${mediaUrl}" alt="Uploaded media preview">`
            }
        `;
        preview.classList.remove("hidden");

        const mediaEl = preview.querySelector(isVideo ? "video" : "img");
        mediaEl.addEventListener(isVideo ? "loadedmetadata" : "load", () => {
            mediaMetadata = isVideo
                ? {
                    width: mediaEl.videoWidth,
                    height: mediaEl.videoHeight,
                    duration: mediaEl.duration,
                }
                : {
                    width: mediaEl.naturalWidth,
                    height: mediaEl.naturalHeight,
                };

            preview.querySelector(".muted").textContent = `${Math.round(file.size / 1024)} KB / ${mediaMetadata.width || "?"} x ${mediaMetadata.height || "?"}${mediaMetadata.duration ? ` / ${mediaMetadata.duration.toFixed(1)} sec` : ""}`;
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    wireRouting();
    wireMobileNav();
    wireTabs();
    wireFilePreviews();
    updateUploadPanels();
    qs("#loginForm").addEventListener("submit", submitLogin);
    qs("#logoutBtn").addEventListener("click", logout);
    qs("#analyzeBtn").addEventListener("click", analyzeContent);
    qs("#urlBtn").addEventListener("click", checkUrl);
    qs("#reportBtn").addEventListener("click", submitReport);
    qs("#mediaBtn").addEventListener("click", analyzeMedia);

    const authenticated = await checkAuth();
    if (authenticated) {
        await loadDashboard();
        showPage(window.location.hash.replace("#", "") || "overview");
    }
});
