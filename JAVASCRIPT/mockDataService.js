// js/mockDataService.js
class MockDataService {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        // Initialize mock data if not exists
        if (!localStorage.getItem('domihive_dashboard_data')) {
            this.initializeMockData();
        }
    }

    initializeMockData() {
        const mockData = {
            users: [
                {
                    id: 1,
                    email: "user@domihive.com",
                    name: "John Doe",
                    role: "user",
                    isActive: true,
                    joinDate: "2024-01-15"
                }
            ],
            dashboard: {
                stats: {
                    revenue: { current: 12500, previous: 9800, trend: "up" },
                    properties: { current: 8, previous: 6, trend: "up" },
                    tenants: { current: 24, previous: 20, trend: "up" },
                    requests: { current: 5, previous: 8, trend: "down" }
                },
                recentActivities: [
                    { id: 1, type: "payment", description: "Rent received from Apt 4B", time: "2 hours ago", amount: 1200 },
                    { id: 2, type: "maintenance", description: "Maintenance request submitted", time: "5 hours ago", status: "pending" },
                    { id: 3, type: "tenant", description: "New tenant application", time: "1 day ago", status: "under review" },
                    { id: 4, type: "payment", description: "Service fee paid", time: "1 day ago", amount: 150 }
                ],
                properties: [
                    { id: 1, name: "Sunset Apartments", units: 4, occupied: 3, status: "active" },
                    { id: 2, name: "Downtown Villa", units: 2, occupied: 2, status: "active" },
                    { id: 3, name: "Garden Heights", units: 3, occupied: 1, status: "active" }
                ]
            }
        };

        localStorage.setItem('domihive_dashboard_data', JSON.stringify(mockData));
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('domihive_current_user')) || null;
    }

    getDashboardData() {
        const data = JSON.parse(localStorage.getItem('domihive_dashboard_data'));
        return data.dashboard;
    }

    updateStats(newStats) {
        const data = JSON.parse(localStorage.getItem('domihive_dashboard_data'));
        data.dashboard.stats = { ...data.dashboard.stats, ...newStats };
        localStorage.setItem('domihive_dashboard_data', JSON.stringify(data));
        return data.dashboard.stats;
    }

    addActivity(activity) {
        const data = JSON.parse(localStorage.getItem('domihive_dashboard_data'));
        activity.id = Date.now();
        activity.time = "Just now";
        data.dashboard.recentActivities.unshift(activity);
        localStorage.setItem('domihive_dashboard_data', JSON.stringify(data));
        return activity;
    }

    // Simulate API delay
    async simulateAPICall(data, delay = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(data), delay);
        });
    }
}

// Create global instance
const mockDataService = new MockDataService();