export const FIND_NAVIGATIONS = `
	query getNavElements {
		cms_navigation_element(distinct_on: placement, order_by: { placement: asc }) {
			id
			description
			placement
			tooltip
		}
		cms_navigation_element_aggregate(distinct_on: placement) {
			aggregate {
				count
			}
		}
	}
`;

export const FIND_NAVIGATION_BY_PLACEMENT = `
	query getMenuItemsByPlacement($placement: String!) {
		cms_navigation_element(
			order_by: { position: asc }
			where: { placement: { _eq: $placement } }
		) {
			id
			created_at
			description
			user_group_ids
			icon_name
			label
			link_target
			placement
			position
			updated_at
			content_type
			content_path
			tooltip
		}
		cms_navigation_element_aggregate(where: { placement: { _eq: $placement } }) {
			aggregate {
				count
			}
		}
	}
`;

export const FIND_NAVIGATION_BY_ID = `
	query getMenuItemById($id: uuid!) {
		cms_navigation_element(where: { id: { _eq: $id } }) {
			id
			created_at
			description
			user_group_ids
			icon_name
			label
			link_target
			placement
			position
			updated_at
			content_type
			content_path
			tooltip
		}
	}
`;

export const UPDATE_NAVIGATION_BY_ID = `
	mutation updateMenuItemById($id: uuid!, $navigationItem: cms_navigation_element_set_input!) {
		update_cms_navigation_element_by_pk(pk_columns: { id: $id }, _set: $navigationItem) {
			id
			created_at
			description
			user_group_ids
			icon_name
			label
			link_target
			placement
			position
			updated_at
			content_type
			content_path
			tooltip
		}
	}
`;

export const INSERT_NAVIGATION = `
	mutation insertMenuItem($navigationItem: cms_navigation_element_insert_input!) {
		insert_cms_navigation_element_one(object: $navigationItem) {
			id
			created_at
			description
			user_group_ids
			icon_name
			label
			link_target
			placement
			position
			updated_at
			content_type
			content_path
			tooltip
		}
	}
`;

export const DELETE_NAVIGATION = `
	mutation deleteMenuItemById($id: uuid!) {
		delete_cms_navigation_element(where: { id: { _eq: $id } }) {
			affected_rows
		}
	}
`;
