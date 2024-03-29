import { UnitCostTypeEnum } from 'generated/graphql'

export const getUnitCostTypeLabel = (unitCostType: UnitCostTypeEnum) => {
  return (
    {
      [UnitCostTypeEnum.HOURLY]: 'Pe oră',
      [UnitCostTypeEnum.FIXED]: 'Fix',
    }[unitCostType] || unitCostType
  )
}

export const getCategoryLabelFromName = (name: string) => {
  return {
    'Human Resources': 'Resurse Umane',
    Accounting: 'Contabilitate',
  }[name]
}
