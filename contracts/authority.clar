;; Voltora Verified Energy Provider Registry
;; Clarity smart contract to manage verified energy providers in a decentralized energy network

(define-data-var admin principal tx-sender)

;; Mapping of verified energy providers
(define-map verified-providers principal bool)

;; Mapping of provider metadata
(define-map provider-metadata principal (tuple (name (string-ascii 50)) (region (string-ascii 30)) (type (string-ascii 20))))

;; Error codes
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-VERIFIED u101)
(define-constant ERR-NOT-FOUND u102)
(define-constant ERR-NAME-EMPTY u103)
(define-constant ERR-REGION-EMPTY u104)
(define-constant ERR-TYPE-EMPTY u105)

;; Internal helper to check admin
(define-private (is-admin)
  (is-eq tx-sender (var-get admin)))

;; Register a new energy provider with metadata
(define-public (register-provider (provider principal) (name (string-ascii 50)) (region (string-ascii 30)) (type (string-ascii 20)))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (not (is-eq name "")) (err ERR-NAME-EMPTY))
    (asserts! (not (is-eq region "")) (err ERR-REGION-EMPTY))
    (asserts! (not (is-eq type "")) (err ERR-TYPE-EMPTY))
    (asserts! (is-none (map-get? verified-providers provider)) (err ERR-ALREADY-VERIFIED))
    (map-set verified-providers provider true)
    (map-set provider-metadata provider { name: name, region: region, type: type })
    (ok true)))

;; Remove an energy provider
(define-public (remove-provider (provider principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-some (map-get? verified-providers provider)) (err ERR-NOT-FOUND))
    (map-delete verified-providers provider)
    (map-delete provider-metadata provider)
    (ok true)))

;; Read-only: check if a provider is verified
(define-read-only (is-verified-provider (provider principal))
  (default-to false (map-get? verified-providers provider)))

;; Read-only: fetch provider metadata
(define-read-only (get-provider-metadata (provider principal))
  (match (map-get? provider-metadata provider)
    metadata (ok metadata)
    (err ERR-NOT-FOUND)))

;; Transfer admin to a new address
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)))

;; Upgrade provider metadata (only admin)
(define-public (update-provider-metadata (provider principal) (name (string-ascii 50)) (region (string-ascii 30)) (type (string-ascii 20)))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-some (map-get? verified-providers provider)) (err ERR-NOT-FOUND))
    (map-set provider-metadata provider { name: name, region: region, type: type })
    (ok true)))

;; Bulk verification (admin only, max 20 addresses)
(define-public (bulk-verify (providers (list 20 principal)))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (map
      (lambda (prov)
        (if (is-none (map-get? verified-providers prov))
          (map-set verified-providers prov true)
          false))
      providers)
    (ok true)))

;; Reset the contract (clear all providers) [for development/testing only]
(define-public (reset-registry)
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    ;; NOTE: Clarity doesn't support iteration for full deletion. Only use in dev/test.
    (ok "Reset simulated (not implemented in Clarity)")
  ))
