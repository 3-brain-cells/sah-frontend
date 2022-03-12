/* eslint-disable no-console */
import React from 'react';
import styled from '@emotion/styled';
import { FaBeer, FaBrain, FaInfoCircle } from 'react-icons/fa';

import Checkbox from '../../components/Checkbox';
import ActionButton from '../../components/ActionButton';
import NumericEntry from '../../components/NumericEntry';
import TextBox from '../../components/TextBox';
import IconButton from '../../components/IconButton';
import Button from '../../components/Button';
import SidebarTea from '../../components/SidebarTea';
import LinkButton from '../../components/LinkButton';
import BaseText from '../../components/BaseText';
import DialogTitle from '../../components/DialogTitle';
import Bold from '../../components/Bold';
import Details from '../../components/Details';
import FormLabel from '../../components/FormLabel';
import Heading from '../../components/Heading';
import InlineLink from '../../components/InlineLink';
import Italics from '../../components/Italics';
import Logo from '../../components/Logo';
import PageTitle from '../../components/PageTitle';
import { SingleSelect } from '../../components/Select';
import Tooltip from '../../components/Tooltip';
import Menu from '../../components/Menu';
import MenuItem from '../../components/MenuItem';
import DataGridDemo from './DataGridDemo';

const Styled = {
    Container: styled.div`
        padding: 16px 32px;
    `,
};

export const isDesignSystemPageEnabled = process.env.NODE_ENV === 'development';

export default function DesignSystemPage(): React.ReactElement {
    return (
        <Styled.Container>
            <PageTitle>Design System Page</PageTitle>
            <BaseText>This is an internal page showing off all of our components :D</BaseText>
            <div>
                <Checkbox selected={false} />
                <Checkbox selected />
                <Checkbox disabled />
                <Checkbox disabled selected />
                <br />
                <NumericEntry placeholder="Placeholder Test" />
                <NumericEntry invalid />
                <br />
                <SingleSelect
                    selectedOption={{ value: 'banana', label: 'banana' }}
                    onSelect={(next) => {
                        console.log(`selected ${next}`);
                    }}
                    options={[
                        { value: 'chocolate', label: 'Chocolate' },
                        { value: 'banana', label: 'Banana' },
                        { value: 'baneana', label: 'Banana' },
                        { value: 'banana2', label: 'Banana' },
                        { value: 'banaana', label: 'Banana' },
                        { value: 'banadna', label: 'Banana' },
                    ]}
                />
                <br />
                <TextBox placeholder="placeholder" />
                <TextBox value="testy" placeholder="Placeholder" />
                <TextBox invalid />
                <SidebarTea number={0} />
                <SidebarTea number={10} />
                <SidebarTea number={100} />
                <ActionButton onClick={() => console.log('clicked')} icon={<FaBeer />} />
                <ActionButton
                    variant="danger"
                    iconColor="danger"
                    onClick={() => console.log('clicked')}
                    icon={<FaBeer />}
                />
                <IconButton onClick={() => console.log('clicked')} icon={<FaBeer />} />
                <Button onClick={() => console.log('clicked')} text="Button" />
                <Button onClick={() => console.log('clicked')} text="Button" disabled />
                <Button onClick={() => console.log('clicked')} text="Button" icon={<FaBeer />} />
                <Button
                    onClick={() => console.log('clicked')}
                    text="Button"
                    icon={<FaBeer />}
                    disabled
                />
                <Button variant="secondary" onClick={() => console.log('clicked')} text="Button" />
                <Button
                    variant="secondary"
                    onClick={() => console.log('clicked')}
                    text="Button"
                    disabled
                />
                <Button
                    variant="secondary"
                    onClick={() => console.log('clicked')}
                    text="Button"
                    icon={<FaBeer />}
                />
                <Button
                    variant="secondary"
                    onClick={() => console.log('clicked')}
                    text="Button"
                    icon={<FaBeer />}
                    disabled
                />
                <Button variant="danger" onClick={() => console.log('clicked')} text="Button" />
                <Button
                    variant="danger"
                    onClick={() => console.log('clicked')}
                    text="Button"
                    disabled
                />
                <Button
                    variant="danger"
                    onClick={() => console.log('clicked')}
                    text="Button"
                    icon={<FaBeer />}
                />
                <Button
                    variant="danger"
                    onClick={() => console.log('clicked')}
                    text="Button"
                    icon={<FaBeer />}
                    disabled
                />
                <Logo>Logo</Logo>
                <DialogTitle>DialogTitle</DialogTitle>
                <PageTitle>PageTitle</PageTitle>
                <Heading>Heading</Heading>
                <BaseText>BaseText</BaseText>
                <BaseText variant="strong">BaseText strong</BaseText>
                <BaseText variant="faded">BaseText faded</BaseText>
                <br />
                <Details>Details </Details>
                <Details>
                    <Italics>Italics</Italics>
                    <br />
                    <Bold>Bold</Bold>
                </Details>
                <FormLabel>FormLabel</FormLabel>
                <InlineLink to="/">InlineLink</InlineLink>
                <br />
                <LinkButton onClick={() => console.log('clicked')}>Link button</LinkButton>
                <Tooltip
                    placement="bottom-start"
                    tooltipContent={<BaseText>Hi I&apos;m a tooltip with some text</BaseText>}
                >
                    {(ref) => (
                        <Button
                            ref={ref}
                            onClick={() => console.log('clicked')}
                            text="Button with tooltip"
                            icon={<FaInfoCircle />}
                        />
                    )}
                </Tooltip>
                <Tooltip
                    placement="right"
                    tooltipContent={<BaseText>Hi I&apos;m a tooltip with some text</BaseText>}
                >
                    {(ref) => (
                        <Button
                            ref={ref}
                            onClick={() => console.log('clicked')}
                            text="Button with tooltip to the side"
                            icon={<FaInfoCircle />}
                        />
                    )}
                </Tooltip>
                <Tooltip
                    interactive
                    placement="bottom-start"
                    tooltipContent={
                        <BaseText>
                            Hi I&apos;m a tooltip with some text and a button
                            <div style={{ height: 4 }} />
                            <Button
                                onClick={() => console.log('inner button clicked')}
                                text="Mind-blowing inner button"
                                icon={<FaBrain />}
                                variant="secondary"
                                style={{ marginBottom: 4 }}
                            />
                        </BaseText>
                    }
                >
                    {(ref) => (
                        <Button
                            ref={ref}
                            onClick={() => console.log('clicked')}
                            text="Button with a tooltip with a button"
                            icon={<FaInfoCircle />}
                        />
                    )}
                </Tooltip>
                <Tooltip
                    placement="bottom-start"
                    trigger="click"
                    tooltipContent={<BaseText>Hi I&apos;m a tooltip with some text</BaseText>}
                >
                    {(ref) => (
                        <Button
                            ref={ref}
                            onClick={() => console.log('clicked')}
                            text="Button with click-triggered tooltip"
                            icon={<FaInfoCircle />}
                        />
                    )}
                </Tooltip>
                <div style={{ height: 48 }} />
                <Menu
                    placement="bottom-start"
                    contents={
                        <>
                            <MenuItem onClick={() => console.log('new clicked')}>New...</MenuItem>
                            <MenuItem onClick={() => console.log('export clicked')}>
                                Export...
                            </MenuItem>
                            <MenuItem onClick={() => console.log('import clicked')}>
                                Import...
                            </MenuItem>
                        </>
                    }
                >
                    {(ref) => <IconButton ref={ref} icon={<FaBeer />} />}
                </Menu>
                <div style={{ height: 48 }} />
                <DataGridDemo />
                <div style={{ height: 400 }} />
            </div>
        </Styled.Container>
    );
}
