import { test, expect, request as playwrightRequest } from '@playwright/test';
const BookingClient = require('../../api-clients/BookingClient');

test.describe('Hotel Booking E2E CRUD Suite', () => {
    test.describe.configure({ mode: 'serial' }); 
    let api;
    let apiContext;
    let bookingId;   // filled in by Test 2, used by Tests 3-7

    test.beforeAll(async () => {
        apiContext = await playwrightRequest.newContext();
        api = new BookingClient(apiContext);
        await api.login('admin', 'password123');
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });

    test('1. Login stores a valid token', async () => {
        expect(api.token).toBeDefined();
        expect(api.token).not.toBeNull();
        expect(api.token.length).toBeGreaterThan(0);
    });

    test('2. Create a new booking returns 200 and a bookingid', async () => {
        const newBooking = {
            firstname: 'Chithra',
            lastname: 'Ram',
            totalprice: 5000,
            depositpaid: true,
            bookingdates: {
                checkin: '2026-06-15',
                checkout: '2026-06-20'
            },
            additionalneeds: 'Breakfast'
        };

        const { status, body } = await api.createBooking(newBooking);

        expect(status).toBe(200);
        expect(body).toHaveProperty('bookingid');
        expect(body.bookingid).toBeGreaterThan(0);

        // Save the booking ID for later tests
        bookingId = body.bookingid;

        // Verify the server stored what we sent
        expect(body.booking.firstname).toBe('Chithra');
        expect(body.booking.lastname).toBe('Ram');
        expect(body.booking.totalprice).toBe(5000);
    });

    test('3. Get booking by ID returns the created booking', async () => {
        const { status, body } = await api.getBooking(bookingId);

        expect(status).toBe(200);
        expect(body.firstname).toBe('Chithra');
        expect(body.lastname).toBe('Ram');
        expect(body.totalprice).toBe(5000);
        expect(body.bookingdates.checkin).toBe('2026-06-15');
        expect(body.bookingdates.checkout).toBe('2026-06-20');
    });

    test('4. Update booking (PUT) replaces the booking fully', async () => {
        const updatedBooking = {
            firstname: 'Chithra',
            lastname: 'Ramesh',
            totalprice: 7500,
            depositpaid: false,
            bookingdates: {
                checkin: '2026-06-15',
                checkout: '2026-06-25'
            },
            additionalneeds: 'Breakfast and Dinner'
        };

        const { status, body } = await api.updateBooking(bookingId, updatedBooking);

        expect(status).toBe(200);
        expect(body.lastname).toBe('Ramesh');
        expect(body.totalprice).toBe(7500);
        expect(body.additionalneeds).toContain('Dinner');
    });

    test('5. Partial update (PATCH) modifies only specified fields', async () => {
        const { status, body } = await api.patchBooking(bookingId, {
            totalprice: 9000
        });

        expect(status).toBe(200);
        expect(body.totalprice).toBe(9000);
        // Other fields preserved from Test 4
        expect(body.firstname).toBe('Chithra');
        expect(body.lastname).toBe('Ramesh');
    });

    test('6. Delete booking returns 201', async () => {
        const { status } = await api.deleteBooking(bookingId);

        // restful-booker returns 201 (not 204) on successful delete — known quirk
        expect(status).toBe(201);
    });

    test('7. Deleted booking returns 404 on GET (verify deletion)', async () => {
        const { status } = await api.getBooking(bookingId);

        expect(status).toBe(404);
    });
});