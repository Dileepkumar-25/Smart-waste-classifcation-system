/**
 * EcoSort AI - Analytics & Impact Engine
 * Manages Chart.js visualizations, user recycling history, EcoPoints, carbon accounting, and gamification.
 */

class EcoAnalytics {
  constructor() {
    this.storageKey = 'ecosort_history_v1';
    this.statsKey = 'ecosort_stats_v1';
    this.pointsKey = 'ecosort_ecopoints_v1';
    
    this.history = this.loadHistory();
    this.stats = this.loadStats();
    this.ecoPoints = this.loadPoints();

    this.chartBreakdown = null;
    this.chartWeekly = null;
    this.chartCarbon = null;

    this.initUI();
  }

  loadHistory() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    // Default seed history for instant vibrant graphs
    return [
      {
        id: "scan_1",
        itemName: "Plastic Water Bottle",
        category: "plastic",
        categoryName: "Plastic Material",
        binName: "Blue Recycling Bin",
        binType: "blue",
        confidence: 98.4,
        timestamp: Date.now() - (3600 * 1000 * 5),
        co2Saved: 0.08,
        imageSrc: "assets/images/sample_plastic_bottle.jpg"
      },
      {
        id: "scan_2",
        itemName: "Organic Apple Core",
        category: "organic",
        categoryName: "Organic & Biodegradable",
        binName: "Green Organic & Compost Bin",
        binType: "green",
        confidence: 97.9,
        timestamp: Date.now() - (3600 * 1000 * 18),
        co2Saved: 0.15,
        imageSrc: "assets/images/sample_apple_core.jpg"
      },
      {
        id: "scan_3",
        itemName: "Corrugated Cardboard Box",
        category: "paper",
        categoryName: "Paper & Cardboard",
        binName: "Blue/Brown Paper Bin",
        binType: "brown",
        confidence: 96.8,
        timestamp: Date.now() - (3600 * 1000 * 28),
        co2Saved: 0.45,
        imageSrc: "assets/images/sample_cardboard_box.jpg"
      },
      {
        id: "scan_4",
        itemName: "Aluminum Soda Can",
        category: "metal",
        categoryName: "Metal & Aluminum",
        binName: "Yellow / Grey Dry Bin",
        binType: "yellow",
        confidence: 99.2,
        timestamp: Date.now() - (3600 * 1000 * 42),
        co2Saved: 0.22,
        imageSrc: "assets/images/sample_soda_can.jpg"
      },
      {
        id: "scan_5",
        itemName: "Glass Beverage Bottle",
        category: "glass",
        categoryName: "Glass Packaging",
        binName: "Teal Glass Bin",
        binType: "teal",
        confidence: 97.5,
        timestamp: Date.now() - (3600 * 1000 * 64),
        co2Saved: 0.31,
        imageSrc: "assets/images/sample_glass_bottle.jpg"
      }
    ];
  }

  loadStats() {
    try {
      const data = localStorage.getItem(this.statsKey);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      totalClassified: 142850,
      recyclableRate: 89.4,
      co2SavedKg: 48.2,
      treesEquivalent: 124
    };
  }

  loadPoints() {
    try {
      const pts = localStorage.getItem(this.pointsKey);
      if (pts) return parseInt(pts, 10);
    } catch (e) {}
    return 320;
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history));
      localStorage.setItem(this.statsKey, JSON.stringify(this.stats));
      localStorage.setItem(this.pointsKey, this.ecoPoints.toString());
    } catch (e) {
      console.warn('Could not save to LocalStorage:', e);
    }
  }

  recordClassification(result) {
    const item = {
      id: "scan_" + Date.now(),
      itemName: result.itemName,
      category: result.categoryId,
      categoryName: result.categoryName,
      binName: result.binName,
      binType: result.binType,
      confidence: result.confidence,
      timestamp: Date.now(),
      co2Saved: parseFloat(result.carbonSavings) || 0.15,
      imageSrc: result.imageSrc
    };

    this.history.unshift(item);
    if (this.history.length > 50) this.history.pop();

    this.ecoPoints += 15;
    this.stats.totalClassified += 1;
    this.stats.co2SavedKg = parseFloat((this.stats.co2SavedKg + item.co2Saved).toFixed(2));
    this.save();

    this.updateUserBadge();
    this.renderHistoryTable();
    this.updateCharts();
  }

  initUI() {
    this.updateUserBadge();
    this.renderHistoryTable();
    
    // Bind Clear History button
    const clearBtn = document.getElementById('clear-history-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your scanning history?')) {
          this.history = [];
          this.save();
          this.renderHistoryTable();
          this.updateCharts();
          window.EcoApp.showNotification('History cleared.', 'info');
        }
      });
    }

    // Initialize charts after window loads
    setTimeout(() => {
      this.initCharts();
    }, 400);
  }

  updateUserBadge() {
    const ptsElem = document.getElementById('user-ecopoints');
    if (ptsElem) ptsElem.textContent = `${this.ecoPoints} Pts`;

    const rankElem = document.getElementById('user-rank');
    const rankProgress = document.getElementById('rank-progress-bar');
    
    let rank = '🌱 Eco Seedling';
    let progress = 30;

    if (this.ecoPoints >= 600) {
      rank = '🌍 Earth Champion';
      progress = 100;
    } else if (this.ecoPoints >= 300) {
      rank = '🛡️ Green Guardian';
      progress = Math.min(95, Math.round(((this.ecoPoints - 300) / 300) * 100));
    } else if (this.ecoPoints >= 100) {
      rank = '🌿 Eco Scout';
      progress = Math.min(95, Math.round(((this.ecoPoints - 100) / 200) * 100));
    }

    if (rankElem) rankElem.textContent = rank;
    if (rankProgress) rankProgress.style.width = `${progress}%`;

    // Update stat cards
    const statTotal = document.getElementById('stat-total-classified');
    if (statTotal) statTotal.textContent = this.stats.totalClassified.toLocaleString();

    const statCo2 = document.getElementById('stat-co2-saved');
    if (statCo2) statCo2.textContent = `${this.stats.co2SavedKg} kg`;

    const statRate = document.getElementById('stat-recyclable-rate');
    if (statRate) statRate.textContent = `${this.stats.recyclableRate}%`;
  }

  renderHistoryTable() {
    const tbody = document.getElementById('history-table-body');
    const emptyHistory = document.getElementById('history-empty');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (this.history.length === 0) {
      if (emptyHistory) emptyHistory.classList.remove('hidden');
      return;
    }

    if (emptyHistory) emptyHistory.classList.add('hidden');

    this.history.slice(0, 10).forEach(item => {
      const tr = document.createElement('tr');
      const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });

      tr.innerHTML = `
        <td class="history-item-cell">
          <img src="${item.imageSrc}" alt="${item.itemName}" class="history-thumb">
          <div>
            <div class="history-item-title">${item.itemName}</div>
            <div class="history-item-date">${dateStr} at ${timeStr}</div>
          </div>
        </td>
        <td>
          <span class="category-chip category-${item.category}">
            ${item.categoryName}
          </span>
        </td>
        <td>
          <div class="bin-badge bin-badge-${item.binType}">${item.binName.split('(')[0]}</div>
        </td>
        <td>
          <div class="confidence-tag">${item.confidence}%</div>
        </td>
        <td>
          <span class="co2-tag">+${item.co2Saved} kg</span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  initCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js library is not yet loaded.');
      return;
    }

    // Set Chart defaults
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    Chart.defaults.color = '#64748b';

    this.initBreakdownChart();
    this.initWeeklyChart();
    this.initCarbonChart();
  }

  initBreakdownChart() {
    const ctx = document.getElementById('chart-waste-breakdown');
    if (!ctx) return;

    // Calculate category distribution from history
    const counts = { plastic: 0, organic: 0, paper: 0, metal: 0, glass: 0, ewaste: 0 };
    this.history.forEach(item => {
      if (counts[item.category] !== undefined) counts[item.category]++;
    });

    // Ensure baseline counts if fresh
    const dataVals = [
      Math.max(1, counts.plastic + 12),
      Math.max(1, counts.organic + 9),
      Math.max(1, counts.paper + 8),
      Math.max(1, counts.metal + 6),
      Math.max(1, counts.glass + 5),
      Math.max(1, counts.ewaste + 2)
    ];

    if (this.chartBreakdown) this.chartBreakdown.destroy();

    this.chartBreakdown = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Plastics', 'Organic', 'Paper & Cardboard', 'Metals', 'Glass', 'E-Waste'],
        datasets: [{
          data: dataVals,
          backgroundColor: [
            '#2563eb', // Blue
            '#10b981', // Emerald
            '#d97706', // Brown/Amber
            '#64748b', // Slate
            '#0d9488', // Teal
            '#dc2626'  // Red
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 14,
              font: { size: 12 }
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  initWeeklyChart() {
    const ctx = document.getElementById('chart-weekly-activity');
    if (!ctx) return;

    if (this.chartWeekly) this.chartWeekly.destroy();

    this.chartWeekly = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Items Sorted',
          data: [14, 21, 18, 25, 32, 28, 38],
          backgroundColor: '#10b981',
          borderRadius: 8,
          hoverBackgroundColor: '#059669'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { stepSize: 10 }
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  initCarbonChart() {
    const ctx = document.getElementById('chart-carbon-trend');
    if (!ctx) return;

    if (this.chartCarbon) this.chartCarbon.destroy();

    this.chartCarbon = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [{
          label: 'Cumulative CO₂ Avoided (kg)',
          data: [8.2, 16.5, 25.1, 33.4, 41.8, 48.2],
          fill: true,
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          borderColor: '#10b981',
          borderWidth: 3,
          tension: 0.35,
          pointBackgroundColor: '#10b981',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' }
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  updateCharts() {
    this.initBreakdownChart();
  }
}

window.EcoAnalytics = EcoAnalytics;
