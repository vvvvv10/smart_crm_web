import { removeRule, clue } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Drawer, Input, message } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const [messageApi, contextHolder] = message.useMessage();

  const { run: delRun, loading } = useRequest(removeRule, {
    manual: true,
    onSuccess: () => {
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();

      messageApi.success('Deleted successfully and will refresh soon');
    },
    onError: () => {
      messageApi.error('Delete failed, please try again');
    },
  });

  const columns: ProColumns<API.ClueListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.clue.id"
          defaultMessage="Rule name"
        />
      ),
      dataIndex: 'id',
      tip: 'The rule name is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.clue.status"
          defaultMessage="Number of service calls"
        />
      ),
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.default"
              defaultMessage="Shut down"
            />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="Running" />
          ),
          status: 'Processing',
        },
        2: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.online" defaultMessage="Online" />
          ),
          status: 'Success',
        },
        3: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.abnormal"
              defaultMessage="Abnormal"
            />
          ),
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.clue.companyName" defaultMessage="Description" />,
      dataIndex: 'companyName',
    },
    {
      title: <FormattedMessage id="pages.searchTable.clue.companyContactsName" defaultMessage="Description" />,
      dataIndex: 'companyContactsName',
    },
    {
      title: <FormattedMessage id="pages.searchTable.clue.companyContactsTel" defaultMessage="Description" />,
      dataIndex: 'companyContactsTel',
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.clue.companyContactsSex" defaultMessage="Description" />,
      dataIndex: 'companyContactsSex',
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.clue.companyContactsEmail" defaultMessage="Description" />,
      dataIndex: 'companyContactsEmail',
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.clue.companyAddress" defaultMessage="Description" />,
      dataIndex: 'companyAddress',
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.clue.companyContactsJobTitle" defaultMessage="Description" />,
      dataIndex: 'companyContactsJobTitle',
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.clue.clueSource" defaultMessage="Description" />,
      dataIndex: 'clueSource',
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.clue.activityName" defaultMessage="Description" />,
      dataIndex: 'activityName',
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.clue.userName" defaultMessage="Description" />,
      dataIndex: 'userName',
    },
    {
      title: <FormattedMessage id="pages.searchTable.clue.remark" defaultMessage="Description" />,
      dataIndex: 'remark',
    },
    {
      title: <FormattedMessage id="pages.searchTable.clue.assignTime" defaultMessage="Status" />,
      dataIndex: 'assignTime',
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.clue.assignTime"
          defaultMessage="Last scheduled time"
        />
      ),
      sorter: true,
      dataIndex: 'assignTime',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.searchTable.exception',
                defaultMessage: 'Please enter the reason for the exception!',
              })}
            />
          );
        }
        return defaultRender(item);
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <UpdateForm
          trigger={
            <a>
              <FormattedMessage id="pages.searchTable.config" defaultMessage="Configuration" />
            </a>
          }
          key="config"
          onOk={actionRef.current?.reload}
          values={record}
        />,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          <FormattedMessage
            id="pages.searchTable.subscribeAlert"
            defaultMessage="Subscribe to alerts"
          />
        </a>,
      ],
    },
  ];

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = useCallback(
    async (selectedRows: API.ClueListItem[]) => {
      if (!selectedRows?.length) {
        messageApi.warning('请选择删除项');

        return;
      }

      await delRun({
        data: {
          key: selectedRows.map((row) => row.key),
        },
      });
    },
    [delRun],
  );

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.ClueListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.clue.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [<CreateForm key="create" reload={actionRef.current?.reload} />]}
        request={clue}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            loading={loading}
            onClick={() => {
              handleRemove(selectedRowsState);
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.companyName && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.companyName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.companyName,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
