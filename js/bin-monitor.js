/**
 * EcoSort AI - Smart Dustbin Composition & Fill Level Predictor
 * Predicts and visualizes the percentage breakdown of each waste type inside the dustbin,
 * identifies the dominant waste stream, and computes overflow warnings and compaction tips.
 */

class DustbinMonitor {
  constructor() {
    this.storageKey = 'ecosort_dustbin_state_v1';
    this.capacity = 50; // default 50 items or liters
    this.binType = 'home'; // 'home' (30L), 'office' (60L), 'public' (120L)
    
    this.state = this.loadState();
    this.initUI();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading dustbin state:', e);
    }

    // Default realistic seed contents
    return {
      plastic: 14,
      organic: 9,
      paper: 6,
      metal: 3,
      glass: 2,
      ewaste: 1
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Error saving dustbin state:', e);
    }
  }

  getCapacityLiters() {
    if (this.binType === 'home') return 30;
    if (this.binType === 'office') return 60;
    return 120;
  }

  getCalculation() {
    const totalItems = Object.values(this.state).reduce((a, b) => a + b, 0);
    const capacity = this.getCapacityLiters();

    if (totalItems === 0) {
      return {
        totalItems: 0,
        fillPercentage: 0,
        status: 'Empty',
        statusColor: '#10b981',
        dominant: null,
        breakdown: []
      };
    }

    // Weight/Volume factor estimates per category (in relative units)
    const weights = {
      plastic: 0.8,
      organic: 1.2,
      paper: 0.9,
      metal: 0.6,
      glass: 1.5,
      ewaste: 1.0
    };

    let totalVolumeUnits = 0;
    const rawBreakdown = Object.entries(this.state).map(([catId, count]) => {
      const vol = count * (weights[catId] || 1);
      totalVolumeUnits += vol;
      return {
        id: catId,
        count: count,
        vol: vol,
        info: window.WASTE_CATEGORIES[catId] || { name: catId, color: '#64748b', binName: 'General' }
      };
    });

    // Compute percentages
    const breakdown = rawBreakdown.map(item => {
      const percentage = totalItems > 0 ? parseFloat(((item.count / totalItems) * 100).toFixed(1)) : 0;
      return {
        ...item,
        percentage
      };
    }).sort((a, b) => b.percentage - a.percentage);

    const dominant = breakdown[0];
    const fillPercentage = Math.min(100, Math.round((totalVolumeUnits / capacity) * 100));

    let status = 'Optimal';
    let statusColor = '#10b981';
    if (fillPercentage >= 90) {
      status = 'Critical / Bin Full';
      statusColor = '#ef4444';
    } else if (fillPercentage >= 70) {
      status = 'Near Capacity (Empty Soon)';
      statusColor = '#f59e0b';
    } else if (fillPercentage >= 40) {
      status = 'Moderate Fill';
      statusColor = '#3b82f6';
    }

    return {
      totalItems,
      totalVolumeUnits: parseFloat(totalVolumeUnits.toFixed(1)),
      capacity,
      fillPercentage,
      status,
      statusColor,
      dominant,
      breakdown
    };
  }

  addItem(categoryId, itemName = '') {
    if (this.state[categoryId] !== undefined) {
      this.state[categoryId]++;
    } else {
      this.state[categoryId] = 1;
    }

    this.saveState();
    this.updateUI();

    const calc = this.getCalculation();
    if (window.EcoApp) {
      window.EcoApp.showNotification(
        `Added to Smart Bin! ${calc.dominant.info.name} is dominant at ${calc.dominant.percentage}%.`,
        'info'
      );
    }
  }

  resetBin() {
    this.state = {
      plastic: 0,
      organic: 0,
      paper: 0,
      metal: 0,
      glass: 0,
      ewaste: 0
    };
    this.saveState();
    this.updateUI();
    if (window.EcoApp) {
      window.EcoApp.showNotification('Dustbin contents cleared.', 'info');
    }
  }

  simulateFullBin() {
    this.state = {
      plastic: 24,
      organic: 16,
      paper: 9,
      metal: 5,
      glass: 3,
      ewaste: 1
    };
    this.saveState();
    this.updateUI();
    if (window.EcoApp) {
      window.EcoApp.showNotification('Simulated high-capacity mixed dustbin contents.', 'success');
    }
  }

  initUI() {
    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    const clearBtn = document.getElementById('dustbin-reset-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to empty the smart dustbin?')) {
          this.resetBin();
        }
      });
    }

    const simBtn = document.getElementById('dustbin-simulate-btn');
    if (simBtn) {
      simBtn.addEventListener('click', () => this.simulateFullBin());
    }

    const binSelect = document.getElementById('dustbin-size-select');
    if (binSelect) {
      binSelect.addEventListener('change', (e) => {
        this.binType = e.target.value;
        this.updateUI();
      });
    }
  }

  updateUI() {
    const calc = this.getCalculation();

    // 1. Dominant Waste Card Banner
    const dominantNameElem = document.getElementById('dustbin-dominant-name');
    const dominantPercentElem = document.getElementById('dustbin-dominant-percent');
    const dominantBadgeElem = document.getElementById('dustbin-dominant-badge');
    const dominantAdviceElem = document.getElementById('dustbin-dominant-advice');
    const dominantCardElem = document.getElementById('dustbin-dominant-card');

    if (calc.dominant && calc.dominant.percentage > 0) {
      if (dominantNameElem) dominantNameElem.textContent = calc.dominant.info.name;
      if (dominantPercentElem) dominantPercentElem.textContent = `${calc.dominant.percentage}%`;
      if (dominantBadgeElem) {
        dominantBadgeElem.textContent = `Most Prevalent (${calc.dominant.count} items)`;
        dominantBadgeElem.style.backgroundColor = calc.dominant.info.bgColor;
        dominantBadgeElem.style.color = calc.dominant.info.color;
        dominantBadgeElem.style.borderColor = calc.dominant.info.color;
      }
      if (dominantCardElem) {
        dominantCardElem.style.borderLeft = `6px solid ${calc.dominant.info.color}`;
      }

      // Generate context-aware advice for the dominant waste
      if (dominantAdviceElem) {
        let advice = '';
        if (calc.dominant.id === 'plastic') {
          advice = `💡 Plastic represents ${calc.dominant.percentage}% of the bin. Crush and compress bottles before disposal to reduce bin volume by 40% and prevent overflow.`;
        } else if (calc.dominant.id === 'organic') {
          advice = `💡 Food & Organic scraps are dominant (${calc.dominant.percentage}%). Transfer to the Green Compost Bin or yard caddy within 24 hours to prevent anaerobic odors.`;
        } else if (calc.dominant.id === 'paper') {
          advice = `💡 Paper & Cardboard make up ${calc.dominant.percentage}%. Ensure pizza boxes and paper towels are free of grease to protect pulp recyclability.`;
        } else if (calc.dominant.id === 'metal') {
          advice = `💡 Metal cans are dominant (${calc.dominant.percentage}%). Clean aluminum cans can be stacked together to save curbside container capacity.`;
        } else {
          advice = `💡 ${calc.dominant.info.name} is the highest waste component (${calc.dominant.percentage}%). Follow standard municipal segregation instructions.`;
        }
        dominantAdviceElem.textContent = advice;
      }
    } else {
      if (dominantNameElem) dominantNameElem.textContent = 'No waste logged';
      if (dominantPercentElem) dominantPercentElem.textContent = '0%';
      if (dominantAdviceElem) dominantAdviceElem.textContent = 'Start classifying waste items to track and predict your dustbin composition in real-time!';
    }

    // 2. Fill Level Gauge & Status
    const fillPercentElem = document.getElementById('dustbin-fill-percent');
    const fillBarElem = document.getElementById('dustbin-fill-bar');
    const fillStatusElem = document.getElementById('dustbin-status-pill');
    const totalCountElem = document.getElementById('dustbin-total-count');

    if (fillPercentElem) fillPercentElem.textContent = `${calc.fillPercentage}%`;
    if (fillBarElem) {
      fillBarElem.style.width = `${calc.fillPercentage}%`;
      fillBarElem.style.backgroundColor = calc.statusColor;
    }
    if (fillStatusElem) {
      fillStatusElem.textContent = calc.status;
      fillStatusElem.style.color = calc.statusColor;
      fillStatusElem.style.borderColor = calc.statusColor;
      fillStatusElem.style.backgroundColor = `${calc.statusColor}15`;
    }
    if (totalCountElem) totalCountElem.textContent = `${calc.totalItems} Items Logged`;

    // 3. 3D Visual Dustbin Cylinder (Liquid/Solid Strata)
    const strataContainer = document.getElementById('dustbin-strata-container');
    if (strataContainer) {
      strataContainer.innerHTML = '';
      if (calc.totalItems === 0) {
        strataContainer.innerHTML = `<div class="dustbin-empty-strata">Bin is currently empty</div>`;
      } else {
        // Stack colored layers representing percentages inside the bin cylinder
        calc.breakdown.forEach(item => {
          if (item.percentage > 0) {
            const layer = document.createElement('div');
            layer.className = 'dustbin-strata-layer';
            layer.style.height = `${item.percentage}%`;
            layer.style.backgroundColor = item.info.color;
            layer.title = `${item.info.name}: ${item.percentage}% (${item.count} items)`;
            layer.innerHTML = `
              <span class="strata-label">${item.info.name.split(' ')[0]} ${item.percentage}%</span>
            `;
            strataContainer.appendChild(layer);
          }
        });
      }
    }

    // 4. Detailed Breakdown Progress Bars List
    const breakdownList = document.getElementById('dustbin-breakdown-list');
    if (breakdownList) {
      breakdownList.innerHTML = '';

      calc.breakdown.forEach(item => {
        const row = document.createElement('div');
        row.className = 'dustbin-breakdown-row';
        row.innerHTML = `
          <div class="dbr-header">
            <div class="dbr-left">
              <span class="dbr-color-dot" style="background-color: ${item.info.color};"></span>
              <span class="dbr-name">${item.info.name}</span>
              ${item === calc.dominant && item.percentage > 0 ? '<span class="dbr-highest-tag">Highest</span>' : ''}
            </div>
            <div class="dbr-right">
              <strong class="dbr-pct">${item.percentage}%</strong>
              <span class="dbr-count">(${item.count} items)</span>
            </div>
          </div>
          <div class="dbr-bar-track">
            <div class="dbr-bar-fill" style="width: ${item.percentage}%; background-color: ${item.info.color};"></div>
          </div>
        `;
        breakdownList.appendChild(row);
      });
    }

    // 5. Also update Result Card mini-badge if result card is visible
    const resultBinCompositionTag = document.getElementById('result-bin-composition-notice');
    if (resultBinCompositionTag && calc.dominant) {
      resultBinCompositionTag.innerHTML = `
        <i data-lucide="pie-chart"></i> Smart Bin Status: <strong>${calc.dominant.info.name} is highest (${calc.dominant.percentage}%)</strong> • Bin is ${calc.fillPercentage}% full.
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

window.DustbinMonitor = DustbinMonitor;
