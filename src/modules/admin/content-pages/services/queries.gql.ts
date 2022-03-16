export const GET_CONTENT_PAGE_BY_PATH = `
	query getContentPageByPath($path: String!) {
		app_content(where: { path: { _eq: $path }, is_deleted: { _eq: false } }) {
			content_type
			content_width
			created_at
			depublish_at
			description
			seo_description
			meta_description
			id
			thumbnail_path
			is_protected
			is_public
			path
			user_profile_id
			profile {
				user: usersByuserId {
					first_name
					last_name
					role {
						id
						label
					}
				}
			}
			publish_at
			published_at
			title
			updated_at
			user_group_ids
			content_content_labels {
				content_label {
					id
					label
					link_to
				}
			}
			contentBlockssBycontentId(order_by: { position: asc }) {
				content_block_type
				content_id
				created_at
				id
				position
				updated_at
				variables
				enum_content_block_type {
					description
					value
				}
			}
		}
	}
`;

export const GET_ITEM_TILE_BY_ID = `
	query getItemTileById($id: bpchar!) {
		obj: app_item_meta(where: { external_id: { _eq: $id } }) {
			created_at
			duration
			browse_path
			thumbnail_path
			title
			description
			issued
			organisation {
				name
				logo_url
			}
			type {
				label
				id
			}
			item_collaterals(where: {description: {_eq: "subtitle"}}) {
				path
				description
				external_id
			}
			view_counts_aggregate {
				aggregate {
					sum {
						count
					}
				}
			}
		}
	}
`;

export const GET_ITEM_BY_EXTERNAL_ID = `
	query getItemByExternalId($externalId: bpchar!) {
		app_item_meta(where: {external_id: {_eq: $externalId}}) {
			external_id
			browse_path
			thumbnail_path
			title
			description
			issued
			organisation {
				name
				logo_url
			}
			duration
			type {
				label
			}
			item_collaterals(where: {description: {_eq: "subtitle"}}) {
				path
				description
				external_id
			}
		}
	}
`;

export const GET_COLLECTION_TILE_BY_ID = `
	query getCollectionTileById($id: uuid!) {
		obj: app_collections(where: {id: {_eq: $id}, is_deleted: { _eq: false }}) {
			created_at
			title
			thumbnail_path
			type {
				label
				id
			}
			collection_fragments_aggregate {
				aggregate {
					count
				}
			}
			view_counts_aggregate {
				aggregate {
					sum {
						count
					}
				}
			}
		}
	}
`;

export const GET_CONTENT_PAGES_WITH_BLOCKS = `
  query getContentPagesWithBlocks(
    $where: cms_content_bool_exp,
    $offset: Int = 0,
    $limit: Int = 10,
    $orderBy: [cms_content_order_by!] = {},
    $labelIds: [uuid!] = [],
    $orUserGroupIds: [cms_content_content_labels_bool_exp!] = {}
  ) {
    cms_content(where: $where, limit: $limit, offset: $offset, order_by: $orderBy) {
      content_type
      created_at
      depublish_at
      description
      seo_description
      meta_description
      id
      thumbnail_path
      is_protected
      is_public
      path
      owner {
          first_name
          last_name
          group {
            id
            label
          }
      }
      publish_at
      published_at
      title
      updated_at
      user_group_ids
      user_profile_id
      content_content_labels {
        content_label {
          id
          label
          link_to
        }
      }
      content_blocks(order_by: { position: asc }) {
        content_block_type
        content_id
        created_at
        id
        position
        updated_at
        variables
        content_block_type
      }
    }
    cms_content_aggregate(where: $where) {
      aggregate {
        count
      }
    }
    cms_content_labels(where: {id: {_in: $labelIds}}) {
      id
      content_content_labels_aggregate(where: {_or: $orUserGroupIds}) {
        aggregate {
          count
        }
      }
    }
  }
`;

export const GET_CONTENT_PAGES = `
  query getContentPages(
    $where: cms_content_bool_exp,
    $offset: Int = 0,
    $limit: Int = 10,
    $orderBy: [cms_content_order_by!] = {},
    $labelIds: [uuid!] = [],
    $orUserGroupIds: [cms_content_content_labels_bool_exp!] = {}
  ) {
    cms_content(where: $where, limit: $limit, offset: $offset, order_by: $orderBy) {
      content_type
      created_at
      depublish_at
      description
      seo_description
      meta_description
      id
      thumbnail_path
      is_protected
      is_public
      path
      owner {
          first_name
          last_name
          group {
            id
            label
          }
      }
      publish_at
      published_at
      title
      updated_at
      user_group_ids
      user_profile_id
      content_content_labels {
        content_label {
          id
          label
          link_to
        }
      }
    }
    cms_content_aggregate(where: $where) {
      aggregate {
        count
      }
    }
    cms_content_labels(where: {id: {_in: $labelIds}}) {
      id
      content_content_labels_aggregate(where: {_or: $orUserGroupIds}) {
        aggregate {
          count
        }
      }
    }
  }
`;

export const GET_PUBLIC_CONTENT_PAGES = `
	query getPublicContentPages(
		$where: app_content_bool_exp
	) {
		app_content(where: $where) {
			path
			updated_at
		}
	}
`;

export const UPDATE_CONTENT_PAGE_PUBLISH_DATES = `
  mutation publishContentPages($now: timestamptz, $publishedAt: timestamptz) {
    publish_content_pages: update_app_content(
      where: {
        _or: [
          {publish_at: {_lte: $now, _is_null: false}, depublish_at: {_gte: $now, _is_null: false}},
          {publish_at: {_lte: $now, _is_null: false}, depublish_at: {_is_null: true}},
          {publish_at: {_is_null: true}, published_at: {_gte: $now, _is_null: false}}
        ],
        published_at: {_is_null: true},
        is_deleted: { _eq: false }
      },
      _set: {published_at: $publishedAt, is_public: true}
    ) {
      affected_rows
    }
    unpublish_content_pages: update_app_content(
      where: {
        depublish_at: {_lt: $now, _is_null: false},
        is_public: {_eq: true}
        is_deleted: { _eq: false }
      },
      _set: {is_public: false}
    ) {
      affected_rows
    }
  }
`;

export const GET_CONTENT_PAGES_BY_IDS = `
	query getContentPagesByIds($ids: [Int!]) {
		app_content(where: {id: {_in: $ids}, is_deleted: { _eq: false }}) {
			user_profile_id
		}
	}
`;

export const GET_CONTENT_PAGE_LABELS_BY_TYPE_AND_LABEL = `
	query getContentPageLabelsByTypeAndLabels($contentType: String!, $labels: [String!]!) {
		app_content_labels(
			where: { label: { _in: $labels }, content_type: { _eq: $contentType } }
		) {
			label
			id
		}
	}
`;

export const GET_CONTENT_PAGE_LABELS_BY_TYPE_AND_ID = `
	query getContentPageLabelsByTypeAndIds($contentType: String!, $labelIds: [Int!]!) {
		app_content_labels(where: { id: { _in: $labelIds }, content_type: { _eq: $contentType } }) {
			label
			id
		}
	}
`;
