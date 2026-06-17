class BookingClient {

    constructor(requestContext) {
        this.request = requestContext;
        this.baseUrl = "https://restful-booker.herokuapp.com";
        this.token = null;
    }

    async login(username, password) {
        // Step 1: send POST
        const response = await this.request.post(`${this.baseUrl}/auth`, {
            data: { username, password }
        });

        // Step 2: check status (throw if not 200)
        if (response.status() !== 200) {
            throw new Error(`Login failed with status ${response.status()}`);
        }

        // Step 3: parse body
        const body = await response.json();

        // Step 4: save token (note: it's 'token' here, not 'accessToken')
        this.token = body.token;

        // Step 5: return the body
        return body;
    }
    async getAllBookingIds() {
        const response = await this.request.get(`${this.baseUrl}/booking`);
        return { status: response.status(), body: await response.json() };
    }

    async getBooking(id) {
        const response = await this.request.get(`${this.baseUrl}/booking/${id}`);
        const status = response.status();
        
        // Only try to parse JSON if status is 200
        let body = null;
        if (status === 200) {
            body = await response.json();
        }
        
        return { status, body };
    }

    async createBooking(bookingData) {
        const response = await this.request.post(`${this.baseUrl}/booking`, {
            headers: { 'Accept': 'application/json' },
            data: bookingData
        });
        return { status: response.status(), body: await response.json() };
    }

    async updateBooking(id, bookingData) {
        if (!this.token) {
            throw new Error('No token found. Call login() first.');
        }
        const response = await this.request.put(`${this.baseUrl}/booking/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${this.token}`
            },
            data: bookingData
        });
        return { status: response.status(), body: await response.json() };
    }

    async patchBooking(id, partialData) {

        if (!this.token) {
            throw new Error('No token found. Call login() first.');
        }
        const response = await this.request.patch(`${this.baseUrl}/booking/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${this.token}`
            },
            data: partialData
        });
        return { status: response.status(), body: await response.json() };
    }
    async deleteBooking(id) {
        if (!this.token) {
            throw new Error('No token found. Call login() first.');
        }
        const response = await this.request.delete(`${this.baseUrl}/booking/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Cookie': `token=${this.token}`
            }
        });
        return { status: response.status() };
    }
}   // ← closes the class

module.exports = BookingClient;