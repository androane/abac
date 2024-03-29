import { useSnackbar } from 'components/snackbar'
import {
  OrganizationUserQuery,
  useOrganizationToggleUserCategoryPermissionMutation,
  useOrganizationCategoriesQuery,
} from 'generated/graphql'
import getErrorMessage from 'utils/api-codes'
import ResponseHandler from 'components/response-handler'
import { Box, Checkbox, FormControlLabel } from '@mui/material'
import React from 'react'
import { getCategoryLabelFromCode } from 'utils/constants'

type Props = {
  user: OrganizationUserQuery['organization']['user']
  loading: boolean
}

const CategoryPermissionsTab: React.FC<Props> = ({ user, loading }) => {
  const { enqueueSnackbar } = useSnackbar()

  const result = useOrganizationCategoriesQuery()

  const [toggleCategoryPermission, { loading: loadingCategoryPerm }] =
    useOrganizationToggleUserCategoryPermissionMutation()

  const onToggleCategoryPermission = async (categoryUuid: string) => {
    try {
      await toggleCategoryPermission({
        variables: {
          userUuid: user.uuid,
          categoryUuid,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleUserCategoryPermission: {
            __typename: 'ToggleUserCategoryPermission',
            error: null,
            user: {
              ...user,
              categories: user.categories.find(c => c.uuid === categoryUuid)
                ? user.categories.filter(c => c.uuid !== categoryUuid)
                : [
                    ...user.categories,
                    {
                      uuid: categoryUuid,
                      name: '',
                      __typename: 'CategoryType',
                    },
                  ],
              __typename: 'UserType',
            },
          },
        },
      })
    } catch (error) {
      enqueueSnackbar(getErrorMessage((error as Error).message), {
        variant: 'error',
      })
    }
  }

  return (
    <Box
      rowGap={3}
      columnGap={0}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
      }}
    >
      <ResponseHandler {...result}>
        {({ organization }) => {
          return (
            <>
              {organization.categories.map(category => {
                const hasCategoryPermission = Boolean(
                  user.categories.find(c => c.uuid === category.uuid),
                )

                return (
                  <FormControlLabel
                    key={category.uuid}
                    label={getCategoryLabelFromCode(category.code)}
                    control={
                      <Checkbox
                        size="medium"
                        checked={hasCategoryPermission}
                        onChange={() => onToggleCategoryPermission(category.uuid)}
                        disabled={loadingCategoryPerm || loading}
                        color="success"
                      />
                    }
                  />
                )
              })}
            </>
          )
        }}
      </ResponseHandler>
    </Box>
  )
}

export default CategoryPermissionsTab
