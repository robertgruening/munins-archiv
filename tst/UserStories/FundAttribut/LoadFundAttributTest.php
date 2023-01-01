<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../UserStories/FundAttribut/LoadFundAttribut.php");

final class LoadFundAttributTest extends TestCase
{
    public function testThereIsNoFundAttributWithId1()
    {
        $loadFundAttribut = new LoadFundAttribut();
        $loadFundAttribut->setId(0);

        $this->assertFalse($loadFundAttribut->run());
        $this->assertNull($loadFundAttribut->getFundAttribut());
        $this->assertCount(1, $loadFundAttribut->getMessages());
        $this->assertEquals("Es gibt kein Fundattribut mit der Id 0!", $loadFundAttribut->getMessages()[0]);
    }

    public function testLoadFundAttributWithId1()
    {
        $loadFundAttribut = new LoadFundAttribut();
        $loadFundAttribut->setId(1);

        $this->assertTrue($loadFundAttribut->run());
        $this->assertInstanceOf(FundAttribut::class, $loadFundAttribut->getFundAttribut());
    }
}