import { UnitCostTypeEnum } from 'generated/graphql'

export const CATEGORY_CODES = ['accounting', 'hr']

export const getUnitCostTypeLabel = (unitCostType: UnitCostTypeEnum) => {
  return {
    [UnitCostTypeEnum.HOURLY]: 'Pe ora',
    [UnitCostTypeEnum.FIXED]: 'Fix',
  }[unitCostType]
}

export const getCategoryLabelFromCode = (categoryCode: string) => {
  return {
    hr: 'Resurse Umane',
    accounting: 'Contabilitate',
  }[categoryCode]
}
