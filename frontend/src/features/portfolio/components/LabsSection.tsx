export function LabsSection() {
  const labs = [
    {
      title: 'Linux & Systems Lab',
      category: 'Operating Systems & Infrastructure',
      icon: '🐧',
      description: 'Hands-on practice configuring POSIX environments, shell automation, and Linux server hardening.',
      completed: [
        'POSIX file permissions, chmod & umask mechanics',
        'User & group management, sudoers policy configuration',
        'Process inspection (ps, top, kill, signals) and background jobs',
        'Bash automation scripts for service health and log rotation',
        'System logs analysis via journalctl and /var/log/syslog',
        'APT & package dependency resolution on Debian/Ubuntu systems',
      ],
      deepening: [
        'OpenSSH hardening (key exchange, disable root login, Fail2ban)',
        'systemd custom service unit creation and lifecycle management',
        'iptables / ufw packet filtering and firewall rules',
      ],
    },
    {
      title: 'Web & Network Security Lab',
      category: 'Cybersecurity & Application Security',
      icon: '🛡️',
      description: 'Defensive engineering against OWASP Top 10 vulnerabilities and modern identity protocols.',
      completed: [
        'OWASP Top 10 mitigation (SQL Injection, XSS, CSRF, broken access control)',
        'Stateless JWT issuance, JWKS public key verification, and RBAC',
        'Secure session hygiene: HttpOnly, SameSite=Lax, Secure cookie attributes',
        'Input sanitization with Jakarta validation and parameterized SQL queries',
        'Cisco Introduction to Cybersecurity certified foundation',
        'DNS, TCP/IP handshake, HTTP/HTTPS protocol inspection with Wireshark',
      ],
      deepening: [
        'Content Security Policy (CSP) headers and nonce validation',
        'OAuth2 PKCE authorization-code grant workflows',
        'API rate limiting and token bucket algorithms with Bucket4j',
      ],
    },
    {
      title: 'Database & Cloud Architecture Lab',
      category: 'Data Engineering & Backend Systems',
      icon: '💾',
      description: 'Relational data modeling, query performance tuning, and cache-aside distributed data flows.',
      completed: [
        '3NF relational normalization and strict foreign key integrity',
        'PostgreSQL indexing (B-Tree, partial unique indexes for soft deletes)',
        'Connection pooling tuning with HikariCP (active/idle pool metrics)',
        'Redis cache-aside caching with explicit eviction upon committed writes',
        'Flyway version-controlled database schema migrations',
        'Multi-stage Docker containers for consistent development parity',
      ],
      deepening: [
        'Distributed transactions and transactional outbox patterns',
        'Database replication topologies and read-replica routing',
        'Kubernetes pod orchestration and resource limits',
      ],
    },
  ]

  return (
    <section id="labs" className="py-14 border-t border-slate-200 dark:border-slate-800">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-400">
            Active Practical Learning
          </p>
        </div>
        <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Security &amp; Engineering Labs
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Documenting my active hands-on technical competencies across Linux systems, application security, and database infrastructure—measured by practical applied capability rather than subjective percentage bars.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {labs.map((lab) => (
          <div
            key={lab.title}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/20"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg dark:bg-slate-800">
                  {lab.icon}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{lab.title}</h3>
                  <p className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">{lab.category}</p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {lab.description}
              </p>

              {/* Completed Competencies */}
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>✓</span> Applied &amp; Completed:
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {lab.completed.map((item) => (
                    <li key={item} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Currently Deepening */}
              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <span>⚡</span> Currently Deepening:
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {lab.deepening.map((item) => (
                    <li key={item} className="flex items-start gap-1.5">
                      <span className="text-cyan-500 mt-0.5">○</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
