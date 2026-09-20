export function greeting(hour: number) { return hour >= 5 && hour < 12 ? 'Good morning.' : hour >= 12 && hour < 18 ? 'Good afternoon.' : 'Good evening.'; }
