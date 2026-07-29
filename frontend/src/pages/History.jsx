import { useEffect, useState } from "react";
import PageContainer from "../layouts/PageContainer.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { deleteScan, getScanHistory } from "../services/scanService.js";
import { formatDateTime } from "../utils/formatters.js";

const CLASSIFICATION_OPTIONS = [
  "",
  "Safe",
  "Suspicious",
  "Malicious",
  "Low",
  "Medium",
  "High",
  "Unknown",
];
const PAGE_SIZE = 10;

export default function History() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: PAGE_SIZE,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [classification, setClassification] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    loadHistory({ page: pagination.page, search, classification });
  }, [pagination.page, search, classification]);

  async function loadHistory({ page, search: searchTerm, classification: filter }) {
    setIsLoading(true);
    setError("");

    try {
      const response = await getScanHistory({
        page,
        perPage: PAGE_SIZE,
        search: searchTerm,
        classification: filter,
      });
      const payload = response.data || {};
      setItems(payload.items || []);
      setPagination(payload.pagination || pagination);
    } catch (requestError) {
      setError(requestError.message || "Failed to load scan history.");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  function submitSearch(event) {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPagination((current) => ({ ...current, page: 1 }));
  }

  function updateClassification(event) {
    setClassification(event.target.value);
    setPagination((current) => ({ ...current, page: 1 }));
  }

  async function handleDelete(scanId) {
    if (!scanId) return;

    setDeletingId(scanId);
    setError("");

    try {
      await deleteScan(scanId);
      const nextPage =
        items.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
      setPagination((current) => ({ ...current, page: nextPage }));
      await loadHistory({ page: nextPage, search, classification });
    } catch (requestError) {
      setError(requestError.message || "Failed to delete scan history entry.");
    } finally {
      setDeletingId("");
    }
  }

  function goToPage(page) {
    setPagination((current) => ({ ...current, page }));
  }

  const hasActiveFilters = Boolean(search || classification);

  return (
    <PageContainer title="Scan History" subtitle="Review, filter, and manage previous URL scans.">
      {error ? <ErrorAlert message={error} onDismiss={() => setError("")} /> : null}

      <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm mb-4">
        <div className="card-body p-4">
          <form className="row g-3 align-items-end" onSubmit={submitSearch}>
            <div className="col-12 col-lg-7">
              <label htmlFor="history-search" className="form-label text-muted small fw-bold text-uppercase tracking-wider">
                Search Scans
              </label>
              <div className="input-group border border-secondary border-opacity-25 rounded-3 overflow-hidden">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <i className="bi bi-search" />
                </span>
                <input
                  id="history-search"
                  className="form-control bg-transparent border-0 text-white"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search by URL or classification..."
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <label htmlFor="history-filter" className="form-label text-muted small fw-bold text-uppercase tracking-wider">
                Classification
              </label>
              <select
                id="history-filter"
                className="form-select bg-dark text-white border-secondary border-opacity-25"
                value={classification}
                onChange={updateClassification}
              >
                {CLASSIFICATION_OPTIONS.map((option) => (
                  <option key={option || "all"} value={option}>
                    {option || "All classifications"}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6 col-lg-2 d-grid">
              <button className="btn btn-info fw-bold" type="submit" disabled={isLoading}>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm overflow-hidden">
        <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between">
          <div className="d-flex align-items-center">
            <i className="bi bi-clock-history text-info me-2 fs-5" />
            <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">
              Scan Records
            </h3>
          </div>
          <span className="text-muted small">
            {formatCount(pagination.total)} result{pagination.total === 1 ? "" : "s"}
          </span>
        </div>

        {isLoading ? (
          <div className="p-5">
            <LoadingSpinner message="Loading scan history..." />
          </div>
        ) : null}

        {!isLoading && items.length > 0 ? (
          <>
            <div className="table-responsive">
              <table
                className="table table-dark table-hover align-middle mb-0"
                style={{
                  "--bs-table-bg": "transparent",
                  "--bs-table-hover-bg": "rgba(255, 255, 255, 0.03)",
                }}
              >
                <thead>
                  <tr className="text-muted text-uppercase tracking-wider fs-8 border-bottom border-secondary border-opacity-15">
                    <th className="ps-4 py-3">URL</th>
                    <th className="py-3">Risk Score</th>
                    <th className="py-3">Classification</th>
                    <th className="py-3">Scan Date</th>
                    <th className="pe-4 py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((scan) => (
                    <tr key={scan.scan_id} className="border-bottom border-secondary border-opacity-10">
                      <td
                        className="ps-4 py-3 text-truncate text-info small fw-semibold"
                        style={{ maxWidth: "360px", fontFamily: "monospace" }}
                        title={scan.url}
                      >
                        {scan.url || "Unknown URL"}
                      </td>
                      <td className="py-3">
                        <span className={`fw-bold ${scoreClass(scan.risk_score)}`}>
                          {Number(scan.risk_score || 0)}%
                        </span>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={scan.classification || "Unknown"} />
                      </td>
                      <td className="py-3 text-muted small">{formatDateTime(scan.scan_date)}</td>
                      <td className="pe-4 py-3 text-end">
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          type="button"
                          onClick={() => handleDelete(scan.scan_id)}
                          disabled={deletingId === scan.scan_id}
                        >
                          {deletingId === scan.scan_id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                              Deleting
                            </>
                          ) : (
                            <>
                              <i className="bi bi-trash me-1" />
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <HistoryPagination pagination={pagination} onPageChange={goToPage} />
          </>
        ) : null}

        {!isLoading && items.length === 0 ? (
          <EmptyState
            icon={hasActiveFilters ? "bi-funnel" : "bi-clock-history"}
            title={hasActiveFilters ? "No Matching Scans" : "No Scan History Yet"}
            description={
              hasActiveFilters
                ? "Adjust the search term or classification filter to find scan records."
                : "Run a URL scan to populate the production scan history."
            }
          />
        ) : null}
      </div>
    </PageContainer>
  );
}

function HistoryPagination({ pagination, onPageChange }) {
  if (!pagination.total_pages || pagination.total_pages <= 1) {
    return null;
  }

  const pages = pageWindow(pagination.page, pagination.total_pages);

  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 p-3 border-top border-secondary border-opacity-25">
      <div className="text-muted small">
        Page {pagination.page} of {pagination.total_pages}
      </div>
      <nav aria-label="Scan history pages">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${pagination.has_prev ? "" : "disabled"}`}>
            <button
              className="page-link bg-dark text-light border-secondary"
              type="button"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.has_prev}
            >
              Previous
            </button>
          </li>
          {pages.map((page) => (
            <li key={page} className={`page-item ${page === pagination.page ? "active" : ""}`}>
              <button
                className="page-link border-secondary"
                type="button"
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${pagination.has_next ? "" : "disabled"}`}>
            <button
              className="page-link bg-dark text-light border-secondary"
              type="button"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.has_next}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function pageWindow(current, total) {
  const start = Math.max(1, current - 2);
  const end = Math.min(total, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function formatCount(value) {
  return new Intl.NumberFormat().format(Number(value || 0));
}

function scoreClass(score) {
  const value = Number(score || 0);
  if (value >= 70) return "text-danger";
  if (value >= 40) return "text-warning";
  return "text-success";
}
