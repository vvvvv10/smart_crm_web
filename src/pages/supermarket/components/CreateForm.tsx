import {addActivities, addRule} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProFormText, ProFormTextArea, ProFormDateRangePicker } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, message, DatePicker } from 'antd';
import { FC } from 'react';

interface CreateFormProps {
  reload?: ActionType['reload'];
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { reload } = props;

  const [messageApi, contextHolder] = message.useMessage();
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const { run, loading } = useRequest(addActivities, {
    manual: true,
    onSuccess: () => {
      messageApi.success('Added successfully');
      reload?.();
    },
    onError: () => {
      messageApi.error('Adding failed, please try again!');
    },
  });

  return (
    <>
      {contextHolder}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newActivities',
          defaultMessage: 'New Activities',
        })}
        trigger={
          <Button type="primary" icon={<PlusOutlined />}>
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>
        }
        width="400px"
        modalProps={{ okButtonProps: { loading } }}
        onFinish={async (value) => {
          await run({ data: value as API.RuleListItem });

          return true;
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.activitiesName"
                  defaultMessage="activitie name is required"
                />
              ),
            },
          ]}
          width="md"
          name="activityName"
          label="活动名称"
        />
        <ProFormText
          width="md"
          name="department"
          label="部门"
        />
        <ProFormDateRangePicker
          fieldProps={{
            format: 'YYYY-MM-DDTHH:mm:ss',
            showTime: true,
            placeholder: ['startTime', 'endTime'],
          }}
        name="time"
        label="时间"
        />

        <ProFormTextArea width="md" name="activitiesContent" label="活动内容"/>
      </ModalForm>
    </>
  );
};

export default CreateForm;
