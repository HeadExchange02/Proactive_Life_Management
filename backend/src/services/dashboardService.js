import { dashboardRepository } from '../repositories/dashboardRepository.js'

export const dashboardService = {
  async overview(userId) {
    const [activeGoals, savedTrips, healthCheckIns, cropPlans, latestBudget] =
      await dashboardRepository.overviewCounts(userId)

    return {
      activeGoals,
      savedTrips,
      healthCheckIns,
      cropPlans,
      monthlyBudget: latestBudget ? Number(latestBudget.monthlyExpenses) : null,
    }
  },
}
