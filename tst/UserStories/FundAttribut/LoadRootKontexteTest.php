<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../UserStories/FundAttribut/LoadRootFundAttribute.php");

final class LoadRootFundAttributeTest extends TestCase
{
    public function testLoadRootFundAttribute()
    {
        $loadRootFundAttribute = new LoadRootFundAttribute();

        $this->assertTrue($loadRootFundAttribute->run());
        $this->assertCount(40, $loadRootFundAttribute->getRootFundAttribute());
        $this->assertInstanceOf(FundAttribut::class, $loadRootFundAttribute->getRootFundAttribute()[0]);
    }
}