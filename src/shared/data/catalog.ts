// Hardcoded equipment catalog for the frontend-only demo.
// Data captured from the Rise Capital backend public catalog (values, statuses,
// rates, images) so the demo matches production exactly — with NO backend/API.
import type {Equipment} from '@/shared/types/rental';

export const CATALOG: Equipment[] = [
  {
    id: '3411532d-d457-4736-92d5-b70ee16cfa78',
    sku: 'RCG-RIG-16',
    name: 'Big Rig – Rig 16',
    category: 'Drilling Rigs',
    image: '/equipment/rcg/rig16/main.png',
    images: ['/equipment/rcg/rig16/main.png', '/equipment/rcg/rig16/2.png'],
    dailyRate: 2000,
    weeklyRate: 14000,
    availability: 'Available',
    depot: 'Zapata County, TX',
    specs: [
      {label: 'Condition', value: 'Field-ready'},
      {label: 'Billing', value: 'Daily'},
      {label: 'Operator', value: 'On request'},
    ],
    utilization: 100,
    rateType: 'DRY_LEASE',
    condition: 'GOOD',
    rigType: 'Drilling Rig',
    fulfillmentMode: 'DROP_OFF',
    maintenanceDueDate: null,
    // Demo booking — shows the red "unavailable" state in the calendar.
    // T00:00:00 keeps the date in local time (a bare date parses as UTC and
    // can render a day early in US timezones).
    unavailableRanges: [
      {from: '2026-07-29T00:00:00', to: '2026-07-30T00:00:00', reason: 'rented'},
    ],
  },
  {
    id: 'c948d844-f7a5-42f2-828b-14a0e99db4ac',
    sku: 'RCG-CABOT-550',
    name: 'Cabot 550 Drilling Rig',
    category: 'Workover & Support Rigs',
    image: '/equipment/rcg/cabot550/main.png',
    images: [
      '/equipment/rcg/cabot550/main.png',
      '/equipment/rcg/cabot550/2.png',
      '/equipment/rcg/cabot550/bop.png',
      '/equipment/rcg/cabot550/pipe-racks.png',
      '/equipment/rcg/cabot550/swivel.png',
    ],
    dailyRate: 800,
    weeklyRate: 5600,
    availability: 'Available',
    depot: 'South Texas',
    specs: [
      {label: 'Condition', value: 'Field-ready'},
      {label: 'Billing', value: 'Daily'},
      {label: 'Operator', value: 'On request'},
    ],
    utilization: 0,
    rateType: 'DRY_LEASE',
    condition: 'GOOD',
    rigType: 'Workover Rig',
    fulfillmentMode: 'DROP_OFF',
    maintenanceDueDate: null,
    // Demo booking — shows the red "unavailable" state in the calendar.
    // T00:00:00 keeps the date in local time (a bare date parses as UTC and
    // can render a day early in US timezones).
    unavailableRanges: [
      {from: '2026-07-29T00:00:00', to: '2026-07-30T00:00:00', reason: 'rented'},
    ],
  },
  {
    id: 'c79edca6-51ed-45a1-b563-26be94abd15f',
    sku: 'RCG-CABOT-900',
    name: 'Cabot 900 Drilling Rig',
    category: 'Workover & Support Rigs',
    image: '/equipment/rcg/cabot900/main.png',
    images: [
      '/equipment/rcg/cabot900/main.png',
      '/equipment/rcg/cabot900/oil-rigs.png',
      '/equipment/rcg/cabot900/cat-motor.png',
      '/equipment/rcg/cabot900/choke-manifold.png',
      '/equipment/rcg/cabot900/fuel-tank.png',
      '/equipment/rcg/cabot900/mud-pump.png',
      '/equipment/rcg/cabot900/mud-pump-2.png',
      '/equipment/rcg/cabot900/accumulator.png',
      '/equipment/rcg/cabot900/rig1-extra.png',
    ],
    dailyRate: 1800,
    weeklyRate: 12600,
    availability: 'Available',
    depot: 'South Texas',
    specs: [
      {label: 'Condition', value: 'Field-ready'},
      {label: 'Billing', value: 'Daily'},
      {label: 'Operator', value: 'On request'},
    ],
    utilization: 0,
    rateType: 'DRY_LEASE',
    condition: 'GOOD',
    rigType: 'Workover Rig',
    fulfillmentMode: 'DROP_OFF',
    maintenanceDueDate: null,
    // Demo booking — shows the red "unavailable" state in the calendar.
    // T00:00:00 keeps the date in local time (a bare date parses as UTC and
    // can render a day early in US timezones).
    unavailableRanges: [
      {from: '2026-07-29T00:00:00', to: '2026-07-30T00:00:00', reason: 'rented'},
    ],
  },
  {
    id: 'aaa9adb6-765d-42b3-ae6e-2104a8abdaa4',
    sku: 'RCG-FORKLIFT',
    name: 'Forklift',
    category: 'Machinery Equipment',
    image: '/equipment/rcg/forklift/main.png',
    images: ['/equipment/rcg/forklift/main.png'],
    dailyRate: 160,
    weeklyRate: 1120,
    availability: 'Available',
    depot: 'South Texas',
    specs: [
      {label: 'Condition', value: 'Field-ready'},
      {label: 'Billing', value: 'Daily'},
      {label: 'Operator', value: 'On request'},
    ],
    utilization: 0,
    rateType: 'DRY_LEASE',
    condition: 'GOOD',
    rigType: 'Machinery',
    fulfillmentMode: 'DROP_OFF',
    maintenanceDueDate: null,
    // Demo booking — shows the red "unavailable" state in the calendar.
    // T00:00:00 keeps the date in local time (a bare date parses as UTC and
    // can render a day early in US timezones).
    unavailableRanges: [
      {from: '2026-07-29T00:00:00', to: '2026-07-30T00:00:00', reason: 'rented'},
    ],
  },
  {
    id: '78d55cce-bf2b-44ff-b091-0194e41d4556',
    sku: 'RCG-RIG-04',
    name: 'Rig 4',
    category: 'Drilling Rigs',
    image: '/equipment/rcg/rig4/main.png',
    images: ['/equipment/rcg/rig4/main.png'],
    dailyRate: 2000,
    weeklyRate: 14000,
    availability: 'Available',
    depot: 'Zapata County, TX',
    specs: [
      {label: 'Condition', value: 'Field-ready'},
      {label: 'Billing', value: 'Daily'},
      {label: 'Operator', value: 'On request'},
    ],
    utilization: 0,
    rateType: 'DRY_LEASE',
    condition: 'GOOD',
    rigType: 'Drilling Rig',
    fulfillmentMode: 'DROP_OFF',
    maintenanceDueDate: null,
    // Demo booking — shows the red "unavailable" state in the calendar.
    // T00:00:00 keeps the date in local time (a bare date parses as UTC and
    // can render a day early in US timezones).
    unavailableRanges: [
      {from: '2026-07-29T00:00:00', to: '2026-07-30T00:00:00', reason: 'rented'},
    ],
  },
  {
    id: 'b6073892-d42b-434e-867f-3e0283705c9a',
    sku: 'RCG-SK-575',
    name: 'Service King 575',
    category: 'Workover & Support Rigs',
    image: '/equipment/rcg/service-king-575/main.png',
    images: [
      '/equipment/rcg/service-king-575/main.png',
      '/equipment/rcg/service-king-575/2.png',
      '/equipment/rcg/service-king-575/3.png',
      '/equipment/rcg/service-king-575/4.png',
      '/equipment/rcg/service-king-575/pump-tank.png',
      '/equipment/rcg/service-king-575/pump-tank-2.png',
      '/equipment/rcg/service-king-575/extra-1.png',
      '/equipment/rcg/service-king-575/extra-2.png',
      '/equipment/rcg/service-king-575/extra-3.png',
    ],
    dailyRate: 800,
    weeklyRate: 5600,
    availability: 'Available',
    depot: 'South Texas',
    specs: [
      {label: 'Condition', value: 'Field-ready'},
      {label: 'Billing', value: 'Daily'},
      {label: 'Operator', value: 'On request'},
    ],
    utilization: 0,
    rateType: 'DRY_LEASE',
    condition: 'GOOD',
    rigType: 'Workover Rig',
    fulfillmentMode: 'DROP_OFF',
    maintenanceDueDate: null,
    // Demo booking — shows the red "unavailable" state in the calendar.
    // T00:00:00 keeps the date in local time (a bare date parses as UTC and
    // can render a day early in US timezones).
    unavailableRanges: [
      {from: '2026-07-29T00:00:00', to: '2026-07-30T00:00:00', reason: 'rented'},
    ],
  },
  {
    id: '377c8d10-2503-4491-a22f-cb195e6d7bac',
    sku: 'RCG-SKID-01',
    name: 'Skid Steer 1',
    category: 'Machinery Equipment',
    image: '/equipment/rcg/skid-steer-1/main.png',
    images: ['/equipment/rcg/skid-steer-1/main.png'],
    dailyRate: 150,
    weeklyRate: 1050,
    availability: 'Available',
    depot: 'South Texas — Ranch',
    specs: [
      {label: 'Condition', value: 'Field-ready'},
      {label: 'Billing', value: 'Daily'},
      {label: 'Operator', value: 'On request'},
    ],
    utilization: 0,
    rateType: 'DRY_LEASE',
    condition: 'GOOD',
    rigType: 'Machinery',
    fulfillmentMode: 'DROP_OFF',
    maintenanceDueDate: null,
    // Demo booking — shows the red "unavailable" state in the calendar.
    // T00:00:00 keeps the date in local time (a bare date parses as UTC and
    // can render a day early in US timezones).
    unavailableRanges: [
      {from: '2026-07-29T00:00:00', to: '2026-07-30T00:00:00', reason: 'rented'},
    ],
  },
  {
    id: '2c40d3f7-9a21-48f2-972a-350f2b9d47fa',
    sku: 'RCG-SKID-02',
    name: 'Skid Steer 2',
    category: 'Machinery Equipment',
    image: '/equipment/rcg/skid-steer-2/main.png',
    images: ['/equipment/rcg/skid-steer-2/main.png'],
    dailyRate: 140,
    weeklyRate: 980,
    availability: 'Available',
    depot: 'South Texas',
    specs: [
      {label: 'Condition', value: 'Field-ready'},
      {label: 'Billing', value: 'Daily'},
      {label: 'Operator', value: 'On request'},
    ],
    utilization: 0,
    rateType: 'DRY_LEASE',
    condition: 'GOOD',
    rigType: 'Machinery',
    fulfillmentMode: 'DROP_OFF',
    maintenanceDueDate: null,
    // Demo booking — shows the red "unavailable" state in the calendar.
    // T00:00:00 keeps the date in local time (a bare date parses as UTC and
    // can render a day early in US timezones).
    unavailableRanges: [
      {from: '2026-07-29T00:00:00', to: '2026-07-30T00:00:00', reason: 'rented'},
    ],
  },
  {
    id: '9e1872a0-bf2e-4c04-a857-2c0c34a4214e',
    sku: 'RCG-WILSON-400',
    name: 'Wilson 400',
    category: 'Workover & Support Rigs',
    image: '/equipment/rcg/wilson400/main.png',
    images: [
      '/equipment/rcg/wilson400/main.png',
      '/equipment/rcg/wilson400/2.png',
    ],
    dailyRate: 450,
    weeklyRate: 3150,
    availability: 'Available',
    depot: 'East Texas / Livingston, TX',
    specs: [
      {label: 'Condition', value: 'Field-ready'},
      {label: 'Billing', value: 'Daily'},
      {label: 'Operator', value: 'On request'},
    ],
    utilization: 0,
    rateType: 'DRY_LEASE',
    condition: 'GOOD',
    rigType: 'Workover Rig',
    fulfillmentMode: 'DROP_OFF',
    maintenanceDueDate: null,
    // Demo booking — shows the red "unavailable" state in the calendar.
    // T00:00:00 keeps the date in local time (a bare date parses as UTC and
    // can render a day early in US timezones).
    unavailableRanges: [
      {from: '2026-07-29T00:00:00', to: '2026-07-30T00:00:00', reason: 'rented'},
    ],
  },
];

export const getEquipmentById = (id: string): Equipment | undefined =>
  CATALOG.find((e) => e.id === id);
